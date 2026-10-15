
export function createLadders(scene) {
  const ladders = scene.physics.add.staticGroup();

  function addLadder(x, y, width, height) {
    // Visible ladder image
    const sprite = scene.add.image(x, y, "ladder");

    // Adjust these dimensions to match your artwork
    sprite.setDisplaySize(width, height);
    sprite.setDepth(1);

    // Invisible zone used to detect climbing
    const zone = scene.add.zone(x, y, width, height);
    scene.physics.add.existing(zone, true);
    ladders.add(zone);
  }

  // Ladder connecting the lower-left and upper-left ledges
  addLadder(232, 335, 32, 120);

  // Ladder connecting the ground and lower-left ledge
  addLadder(224, 435, 30, 70);

  return ladders;
}

export function handleClimbing(
  player,
  cursors,
  isTouchingLadder
) {
  if (isTouchingLadder) {
    player.body.setAllowGravity(false);

    if (cursors.up.isDown) {
      player.setVelocityY(-140);
    } else if (cursors.down.isDown) {
      player.setVelocityY(140);
    } else {
      player.setVelocityY(0);
    }

    return true;
  }

  player.body.setAllowGravity(true);
  return false;
}
