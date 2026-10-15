export function createPlatforms(scene) {
  const platforms = scene.physics.add.staticGroup();

  addLedge(scene, platforms, 400, 584, 800, 32);
  addLedge(scene, platforms, 600, 430, 220, 16);
  addLedge(scene, platforms, 720, 330, 110, 16);
  addLedge(scene, platforms, 700, 230, 180, 16);

  return platforms;
}

function addLedge(scene, platforms, x, y, width, height) {
  const ledge = scene.add.rectangle(x, y, width, height, 0x5c4033, 0);
  scene.physics.add.existing(ledge, true);
  platforms.add(ledge);
}
