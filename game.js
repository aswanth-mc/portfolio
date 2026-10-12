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
let messageText;
let keyE;
let isModalOpen = false; // Fixed spelling

function preload() {
  // Preload assets here later
}

function create() {
  // 1. Create ground
  ground = this.add.rectangle(400, 430, 800, 40, 0x3d7343);
  this.physics.add.existing(ground, true);

  // 2. Create signpost
  signpost = this.add.rectangle(600, 390, 30, 40, 0x8b5a2b);
  this.physics.add.existing(signpost, true);
  this.add.text(560, 340, "Projects", { fontSize: '14px', fill: '#ffffff' });

  // 3. Create player
  player = this.add.rectangle(100, 350, 28, 40, 0x3498db);
  this.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);
  this.physics.add.collider(player, ground);

  // 4. UI Message
  messageText = this.add.text(20, 20, "Use Arrow Keys or A/D to move, Space/Up to jump", {
    fontSize: '14px',
    fill: '#ffffff',
    backgroundColor: '#00000088',
    padding: { x: 8, y: 4 }
  });

  // 5. Controls
  cursors = this.input.keyboard.createCursorKeys();
  keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  // Modal close handlers
  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  this.input.keyboard.on('keydown-ESC', closeModal);
}

function update() {
  // If the popup is open, freeze movement
  if (isModalOpen) {
    player.body.setVelocityX(0);
    return;
  }

  // Left / Right movement
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

  // Check distance to signpost
  const distance = Phaser.Math.Distance.Between(player.x, player.y, signpost.x, signpost.y);

  if (distance < 50) {
    messageText.setText("Press [E] to view Projects!");

    if (Phaser.Input.Keyboard.JustDown(keyE)) {
      openModal();
    }
  } else {
    messageText.setText("Explore the world using Arrow Keys!");
  }
}

function openModal() {
  isModalOpen = true;
  const modal = document.getElementById('portfolio-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal() {
  isModalOpen = false;
  const modal = document.getElementById('portfolio-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}