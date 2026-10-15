export function createPlatforms(scene) {
  const platforms = scene.physics.add.staticGroup();

  // --- Aligned to your 960 x 540 background artwork ---
  
  // 1. Center Starting Island (spawn area)
  addLedge(scene, platforms, 530, 490, 400, 16);

  // 2. Lower-Left Island (About Me house)
  addLedge(scene, platforms, 215, 425, 180, 16);

  // 3. Upper-Left Floating Island (Projects chest)
  addLedge(scene, platforms, 280, 317, 182, 16);

  // 4. Right Island (Experience & Contact Mailbox)
  addLedge(scene, platforms, 100, 490, 190, 16);

  return platforms;
}

function addLedge(scene, platforms, x, y, width, height) {
  // Alpha = 0 keeps it completely invisible
  const ledge = scene.add.rectangle(x, y, width, height, 0x00ff00, 0);
  scene.physics.add.existing(ledge, true); // true = static body
  ledge.body.checkCollision.down = false;  // Optional: allows jumping through from underneath
  platforms.add(ledge);
}