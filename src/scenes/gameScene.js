import { createPlayer } from "../entities/player.js";
import { createPlatforms } from "../objects/platforms.js";
import { createLadders, handleClimbing } from '../objects/ladder.js';
import { createStations } from "../objects/stations.js";
import { openModal, setupModalEvents } from "../ui/modal.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.isModalOpen = false;
  }

  preload() {
    this.load.image("world-bg", "assets/background.png");
    this.load.image("ladder", "assets/ladder.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    this.add.image(480, 300, "world-bg").setDisplaySize(960, 540);

    this.platforms = createPlatforms(this);
    this.ladders = createLadders(this);
    this.player = createPlayer(this, this.platforms);
    this.stations = createStations(this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.messageText = this.add.text(
      20,
      20,
      "Jump across platforms using Arrow Keys / Space!",
      {
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 8, y: 4 }
      }
    );

    this.setupAnimations();
    setupModalEvents(this);
  }


update() {
  // 1. Stop movement while a modal is open
  if (this.isModalOpen) {
    this.player.setVelocityX(0);
    this.player.anims.play("turn");
    return;
  }

  // 2. Detect whether the player touches a ladder
  const isTouchingLadder = this.physics.overlap(
    this.player,
    this.ladders
  );

  // 3. Handle ladder climbing
  const isClimbing = handleClimbing(
    this.player,
    this.cursors,
    isTouchingLadder
  );

  // 4. Horizontal movement
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-180);
    this.player.anims.play("left", true);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(180);
    this.player.anims.play("right", true);
  } else {
    this.player.setVelocityX(0);
    this.player.anims.play("turn");
  }

  // 5. Jump only when not climbing
  const onGround =
    this.player.body.blocked.down ||
    this.player.body.touching.down;

  if (
    !isClimbing &&
    (this.cursors.up.isDown || this.cursors.space.isDown) &&
    onGround
  ) {
    this.player.setVelocityY(-460);
  }

  // 6. Calculate distance to interactive stations
  const { aboutBox, signpost, contactBox } = this.stations;

  const distToAbout = Phaser.Math.Distance.Between(
    this.player.x,
    this.player.y,
    aboutBox.x,
    aboutBox.y
  );

  const distToProjects = Phaser.Math.Distance.Between(
    this.player.x,
    this.player.y,
    signpost.x,
    signpost.y
  );

  const distToContact = Phaser.Math.Distance.Between(
    this.player.x,
    this.player.y,
    contactBox.x,
    contactBox.y
  );

  // 7. Handle station interactions
  if (distToAbout < 50) {
    this.messageText.setText("Press [E] to read About Me!");

    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      openModal(this, "about");
    }
  } else if (distToProjects < 50) {
    this.messageText.setText("Press [E] to view Projects!");

    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      openModal(this, "projects");
    }
  } else if (distToContact < 50) {
    this.messageText.setText("Press [E] to open Contact Guild!");

    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      openModal(this, "contact");
    }
  } else if (isTouchingLadder) {
    this.messageText.setText(
      "Use UP / DOWN arrows to climb!"
    );
  } else {
    this.messageText.setText(
      "Jump across platforms using Arrow Keys / Space!"
    );
  }
}

  setupAnimations() {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }
}
