const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false // Set to true only if you want to inspect hitboxes
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;
let signpost;
let contactBox;
let aboutBox;
let messageText;
let keyE;
let isModalOpen = false;

function preload() {
  // 1. Load Background Sky
  this.load.image('world-bg', 'assets/background.png');


  // 2. Load Ground / Platform bar
  
  // 3. Load Character
  this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create() {
  // 1. Background Sky (Centered at 400, 300)
  const bg = this.add.image(480, 300, 'world-bg');
  bg.setDisplaySize(960, 540);

  // 2. Static Platforms Group
  platforms = this.physics.add.staticGroup();

  // Bottom main floor (scaled x2 to span the 800px width)
  platforms.create(400, 584, 'ground').setScale(2).refreshBody();

  // Floating ledges
  platforms.create(600, 450, 'ground');
  platforms.create(100, 320, 'ground');
  platforms.create(700, 220, 'ground');

  // 3. Interactive Stations
  // About (on the bottom ground)
  const aboutGroup = this.add.container(180, 530);
  const aboutGfx = this.add.graphics();
  // Stone pedestal base
  aboutGfx.fillStyle(0x4a4a5a, 1);
  aboutGfx.fillRect(-16, 6, 32, 10);
  aboutGfx.fillRect(-12, -4, 24, 10);
  // Open Purple Tome
  aboutGfx.fillStyle(0x7b2cbf, 1);
  aboutGfx.fillRect(-14, -18, 28, 14);
  // Book pages
  aboutGfx.fillStyle(0xf8f9fa, 1);
  aboutGfx.fillRect(-12, -16, 11, 10);
  aboutGfx.fillRect(1, -16, 11, 10);
  // Bookmark ribbon
  aboutGfx.fillStyle(0xffd166, 1);
  aboutGfx.fillRect(-1, -16, 2, 12);
  aboutGroup.add(aboutGfx);

  // Interaction trigger zone
  aboutBox = this.add.zone(180, 520, 40, 40);
  this.physics.world.enable(aboutBox);
  aboutBox.body.setAllowGravity(false);
  aboutBox.body.moves = false;

  this.add.text(180, 485, "📖 About Me", {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#ffffff',
    backgroundColor: '#00000088',
    padding: { x: 4, y: 2 }
  }).setOrigin(0.5);

  // Projects (on the middle floating ledge at y: 420)
  const chestGroup = this.add.container(600, 395);
  const chestGfx = this.add.graphics();
  // Chest wooden body
  chestGfx.fillStyle(0x8b5a2b, 1);
  chestGfx.fillRect(-18, -12, 36, 24);
  // Dark wood shading
  chestGfx.fillStyle(0x5c3a1e, 1);
  chestGfx.fillRect(-16, -2, 32, 12);
  // Golden metal bands & lock
  chestGfx.fillStyle(0xf1c40f, 1);
  chestGfx.fillRect(-18, -8, 36, 3);
  chestGfx.fillRect(-18, 4, 36, 3);
  chestGfx.fillRect(-4, -4, 8, 8); // Gold latch
  chestGfx.fillStyle(0x111111, 1);
  chestGfx.fillRect(-2, -1, 4, 4); // Keyhole
  chestGroup.add(chestGfx);

  // Interaction trigger zone
  signpost = this.add.zone(600, 395, 48, 40);
  this.physics.world.enable(signpost);
  signpost.body.setAllowGravity(false);
  signpost.body.moves = false;

  this.add.text(600, 360, "📦 Projects Vault", {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#ffffff',
    backgroundColor: '#00000088',
    padding: { x: 4, y: 2 }
  }).setOrigin(0.5);

  // Contact (on the high floating ledge at y: 220)
  const mailGroup = this.add.container(700, 195);
  const mailGfx = this.add.graphics();
  // Wooden post
  mailGfx.fillStyle(0x6b4226, 1);
  mailGfx.fillRect(-3, 2, 6, 20);
  // Red metal mailbox box
  mailGfx.fillStyle(0xd90429, 1);
  mailGfx.fillRoundedRect(-14, -14, 28, 18, 4);
  // Mail slot
  mailGfx.fillStyle(0x2b2b2b, 1);
  mailGfx.fillRect(-10, -8, 20, 3);
  // Yellow alert flag
  mailGfx.fillStyle(0xffd166, 1);
  mailGfx.fillRect(14, -12, 3, 10);
  mailGfx.fillRect(17, -12, 6, 4);
  mailGroup.add(mailGfx);

  // Interaction trigger zone
  contactBox = this.add.zone(700, 195, 40, 40);
  this.physics.world.enable(contactBox);
  contactBox.body.setAllowGravity(false);
  contactBox.body.moves = false;

  this.add.text(700, 155, "📬 Mailbox (Contact)", {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#ffffff',
    backgroundColor: '#00000088',
    padding: { x: 4, y: 2 }
  }).setOrigin(0.5);

  // 4. Player Setup
  player = this.physics.add.sprite(80, 500, 'dude');
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);

  // Collision with all platforms
  this.physics.add.collider(player, platforms);

  // 5. Animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  // Floating bob animation for all 3 icons
  this.tweens.add({
    targets: [aboutGroup, chestGroup, mailGroup],
    y: '-=4',
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  // 6. UI Text
  messageText = this.add.text(20, 20, "Jump across platforms using Arrow Keys / Space!", {
    fontSize: '14px',
    fill: '#ffffff',
    backgroundColor: '#000000aa',
    padding: { x: 8, y: 4 }
  });

  // 7. Inputs & Modals
  cursors = this.input.keyboard.createCursorKeys();
  keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  const modal = document.getElementById('portfolio-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') closeModal();
  });
}

function update() {
  if (isModalOpen) {
    player.setVelocityX(0);
    player.anims.play('turn');
    return;
  }

  // Horizontal Movement
  if (cursors.left.isDown) {
    player.setVelocityX(-180);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(180);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  // Jump logic (can jump when touching ground/ledge)
  if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
    player.setVelocityY(-400);
  }

  // Distance checks
  const distToAbout = Phaser.Math.Distance.Between(player.x, player.y, aboutBox.x, aboutBox.y);
  const distToProjects = Phaser.Math.Distance.Between(player.x, player.y, signpost.x, signpost.y);
  const distToContact = Phaser.Math.Distance.Between(player.x, player.y, contactBox.x, contactBox.y);

  if (distToAbout < 50) {
    messageText.setText("Press [E] to read About Me!");
    if (Phaser.Input.Keyboard.JustDown(keyE)) {
      openModal('about');
    }
  } else if (distToProjects < 50) {
    messageText.setText("Press [E] to view Projects!");
    if (Phaser.Input.Keyboard.JustDown(keyE)) {
      openModal('projects');
    }
  } else if (distToContact < 50) {
    messageText.setText("Press [E] to open Contact Guild!");
    if (Phaser.Input.Keyboard.JustDown(keyE)) {
      openModal('contact');
    }
  } else {
    messageText.setText("Jump across platforms using Arrow Keys / Space!");
  }
}

function openModal(type) {
  isModalOpen = true;
  const modal = document.getElementById('portfolio-modal');
  const aboutView = document.getElementById('about-view');
  const projectsView = document.getElementById('projects-view');
  const contactView = document.getElementById('contact-view');

  if (!modal || !aboutView || !projectsView || !contactView) return;

  // 1. Hide all views first
  aboutView.classList.add('hidden');
  projectsView.classList.add('hidden');
  contactView.classList.add('hidden');

  // 2. Reveal only the requested view by removing 'hidden'
  if (type === 'about') {
    aboutView.classList.remove('hidden');
  } else if (type === 'projects') {
    projectsView.classList.remove('hidden');
  } else if (type === 'contact') {
    contactView.classList.remove('hidden');
  }

  // 3. Reveal the modal wrapper
  modal.classList.remove('hidden');
}

function closeModal() {
  isModalOpen = false;
  const modal = document.getElementById('portfolio-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

