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
let messageText;
let keyE;
let isModalOpen = false;

function preload() {}

function create() {
  // 1. Ground platform
  ground = this.add.rectangle(400, 430, 800, 40, 0x3d7343);
  this.physics.add.existing(ground, true);

  // 2. Contact Station (Left Side)
  contactBox = this.add.rectangle(250, 395, 25, 30, 0xb84343); // Red mailbox style
  this.physics.add.existing(contactBox, true);
  this.add.text(220, 350, "Contact", { fontSize: '14px', fill: '#ffffff' });

  // 3. Projects Signpost (Right Side)
  signpost = this.add.rectangle(600, 390, 30, 40, 0x8b5a2b);
  this.physics.add.existing(signpost, true);
  this.add.text(560, 340, "Projects", { fontSize: '14px', fill: '#ffffff' });

  // 4. Player
  player = this.add.rectangle(100, 350, 28, 40, 0x3498db);
  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);
  this.physics.add.collider(player, ground);

  // 5. Instruction text
  messageText = this.add.text(20, 20, "Explore using Arrow Keys!", {
    fontSize: '14px',
    fill: '#ffffff',
    backgroundColor: '#00000088',
    padding: { x: 8, y: 4 }
  });

  // 6. Keyboard & modal listeners
  cursors = this.input.keyboard.createCursorKeys();
  keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  this.input.keyboard.on('keydown-ESC', closeModal);
}

function update() {
  if (isModalOpen) {
    player.body.setVelocityX(0);
    return;
  }

  // Left/Right Movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(160);
  } else {
    player.body.setVelocityX(0);
  }

  // Jumping
  if ((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
    player.body.setVelocityY(-350);
  }

  // Proximity to Projects and Contact
  const distToProjects = Phaser.Math.Distance.Between(player.x, player.y, signpost.x, signpost.y);
  const distToContact = Phaser.Math.Distance.Between(player.x, player.y, contactBox.x, contactBox.y);

  if (distToProjects < 50) {
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
  const modal = document.getElementById('portfolio-modal');
  const projectsView = document.getElementById('projects-view');
  const contactView = document.getElementById('contact-view');

  if (!modal || !projectsView || !contactView) return;

  isModalOpen = true;

  if (type === 'projects') {
    projectsView.classList.remove('hidden');
    projectsView.style.display = 'block';

    contactView.classList.add('hidden');
    contactView.style.display = 'none';
  } else if (type === 'contact') {
    projectsView.classList.add('hidden');
    projectsView.style.display = 'none';

    contactView.classList.remove('hidden');
    contactView.style.display = 'block';
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  isModalOpen = false;
  const modal = document.getElementById('portfolio-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}