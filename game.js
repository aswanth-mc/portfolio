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
  this.load.image('sky', 'https://labs.phaser.io/assets/skies/space3.png');
  // Alternatively for a light blue sky:
  // this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky4.png');

  // 2. Load Ground / Platform bar
  this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');

  // 3. Load Character
  this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create() {
  // 1. Background Sky (Centered at 400, 300)
  this.add.image(400, 300, 'sky');

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
  aboutBox = this.add.rectangle(180, 285, 25, 30, 0x9b59b6);
  this.physics.add.existing(aboutBox, true);
  this.add.text(160, 245, "About", { fontSize: '14px', fill: '#ffffff' });

  // Projects (on the middle floating ledge at y: 420)
  signpost = this.add.rectangle(600, 415, 30, 40, 0x8b5a2b);
  this.physics.add.existing(signpost, true);
  this.add.text(565, 375, "Projects", { fontSize: '14px', fill: '#ffffff' });

  // Contact (on the high floating ledge at y: 220)
  contactBox = this.add.rectangle(700, 185, 25, 30, 0xb84343);
  this.physics.add.existing(contactBox, true);
  this.add.text(670, 145, "Contact", { fontSize: '14px', fill: '#ffffff' });

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

  aboutView.style.display = 'none';
  projectsView.style.display = 'none';
  contactView.style.display = 'none';

  if (type === 'about') {
    aboutView.style.display = 'block';
  } else if (type === 'projects') {
    projectsView.style.display = 'block';
  } else if (type === 'contact') {
    contactView.style.display = 'block';
  }

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
}

function closeModal() {
  isModalOpen = false;
  const modal = document.getElementById('portfolio-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}