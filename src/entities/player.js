export function createPlayer(scene, platforms) {
  const player = scene.physics.add.sprite(80, 500, "dude");

  player.setBounce(0.1);
  player.setCollideWorldBounds(true);

  if (platforms) {
    scene.physics.add.collider(player, platforms);
  }

  return player;
}
