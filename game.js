const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
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
let ground;
let signpost;
let contactBox;
let aboutBox;
let messageText;
let keyE;
let isModalOpen = false;

function preload() {
  // Load the official Phaser dude spritesheet directly from the web
  this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create() {
  // 1. Ground platform
  ground = this.add.rectangle(400, 430, 800, 40, 0x3d7343);
  this.physics.add.existing(ground, true);

  // 2. About Station (Left Side)
  aboutBox = this.add.rectangle(250, 395, 25, 30, 0x9b59b6); // Purple marker
  this.physics.add.existing(aboutBox, true);
  this.add.text(230, 350, "About", { fontSize: '14px', fill: '#ffffff' });

  // 3. Projects Signpost (Center-Right)
  signpost = this.add.rectangle(550, 390, 30, 40, 0x8b5a2b); // Brown wooden sign
  this.physics.add.existing(signpost, true);
  this.add.text(515, 340, "Projects", { fontSize: '14px', fill: '#ffffff' });

  // 4. Contact Station (Far Right)
  contactBox = this.add.rectangle(730, 395, 25, 30, 0xb84343); // Red mailbox
  this.physics.add.existing(contactBox, true);
  this.add.text(700, 350, "Contact", { fontSize: '14px', fill: '#ffffff' });

  // 5. Player
  // --- Replace the blue rectangle with this ---
  player = this.physics.add.sprite(100, 350, 'dude');
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, ground);

  // Animations for the dude
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // 6. Instruction text
  messageText = this.add.text(20, 20, "Explore using Arrow Keys!", {
    fontSize: '14px',
    fill: '#ffffff',
    backgroundColor: '#00000088',
    padding: { x: 8, y: 4 }
  });

  // 7. Controls setup
  cursors = this.input.keyboard.createCursorKeys();
  keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  // 8. Close Button Click Event
  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  // 9. Click outside the modal overlay to close
  const modal = document.getElementById('portfolio-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // 10. Press Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeModal();
    }
  });
}

function update() {
  if (isModalOpen) {
    player.setVelocityX(0);
    player.anims.play('turn');
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
    player.setVelocityY(-350);
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
    messageText.setText("Explore the world using Arrow Keys!");
  }
}

function openModal(type) {
  isModalOpen = true;
  const modal = document.getElementById('portfolio-modal');
  const aboutView = document.getElementById('about-view');
  const projectsView = document.getElementById('projects-view');
  const contactView = document.getElementById('contact-view');

  if (!modal || !aboutView || !projectsView || !contactView) return;

  // Hide all sections first
  aboutView.style.display = 'none';
  aboutView.classList.add('hidden');

  projectsView.style.display = 'none';
  projectsView.classList.add('hidden');

  contactView.style.display = 'none';
  contactView.classList.add('hidden');

  // Display only the requested section
  if (type === 'about') {
    aboutView.classList.remove('hidden');
    aboutView.style.display = 'block';
  } else if (type === 'projects') {
    projectsView.classList.remove('hidden');
    projectsView.style.display = 'block';
  } else if (type === 'contact') {
    contactView.classList.remove('hidden');
    contactView.style.display = 'block';
  }

  // Display the modal overlay
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