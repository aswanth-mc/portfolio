export function createStations(scene) {
  const aboutGroup = scene.add.container(180, 530);
  const aboutGfx = scene.add.graphics();
  aboutGfx.fillStyle(0x4a4a5a, 1);
  aboutGfx.fillRect(-16, 6, 32, 10);
  aboutGfx.fillRect(-12, -4, 24, 10);
  aboutGfx.fillStyle(0x7b2cbf, 1);
  aboutGfx.fillRect(-14, -18, 28, 14);
  aboutGfx.fillStyle(0xf8f9fa, 1);
  aboutGfx.fillRect(-12, -16, 11, 10);
  aboutGfx.fillRect(1, -16, 11, 10);
  aboutGfx.fillStyle(0xffd166, 1);
  aboutGfx.fillRect(-1, -16, 2, 12);
  aboutGroup.add(aboutGfx);

  const aboutBox = scene.add.zone(180, 520, 40, 40);
  scene.physics.world.enable(aboutBox);
  aboutBox.body.setAllowGravity(false);
  aboutBox.body.moves = false;

  scene.add.text(180, 485, "📖 About Me", {
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#ffffff",
    backgroundColor: "#00000088",
    padding: { x: 4, y: 2 }
  }).setOrigin(0.5);

  const chestGroup = scene.add.container(600, 395);
  const chestGfx = scene.add.graphics();
  chestGfx.fillStyle(0x8b5a2b, 1);
  chestGfx.fillRect(-18, -12, 36, 24);
  chestGfx.fillStyle(0x5c3a1e, 1);
  chestGfx.fillRect(-16, -2, 32, 12);
  chestGfx.fillStyle(0xf1c40f, 1);
  chestGfx.fillRect(-18, -8, 36, 3);
  chestGfx.fillRect(-18, 4, 36, 3);
  chestGfx.fillRect(-4, -4, 8, 8);
  chestGfx.fillStyle(0x111111, 1);
  chestGfx.fillRect(-2, -1, 4, 4);
  chestGroup.add(chestGfx);

  const signpost = scene.add.zone(600, 395, 48, 40);
  scene.physics.world.enable(signpost);
  signpost.body.setAllowGravity(false);
  signpost.body.moves = false;

  scene.add.text(600, 360, "📦 Projects Vault", {
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#ffffff",
    backgroundColor: "#00000088",
    padding: { x: 4, y: 2 }
  }).setOrigin(0.5);

  const mailGroup = scene.add.container(700, 195);
  const mailGfx = scene.add.graphics();
  mailGfx.fillStyle(0x6b4226, 1);
  mailGfx.fillRect(-3, 2, 6, 20);
  mailGfx.fillStyle(0xd90429, 1);
  mailGfx.fillRoundedRect(-14, -14, 28, 18, 4);
  mailGfx.fillStyle(0x2b2b2b, 1);
  mailGfx.fillRect(-10, -8, 20, 3);
  mailGfx.fillStyle(0xffd166, 1);
  mailGfx.fillRect(14, -12, 3, 10);
  mailGfx.fillRect(17, -12, 6, 4);
  mailGroup.add(mailGfx);

  const contactBox = scene.add.zone(700, 195, 40, 40);
  scene.physics.world.enable(contactBox);
  contactBox.body.setAllowGravity(false);
  contactBox.body.moves = false;

  scene.add.text(700, 155, "📬 Mailbox (Contact)", {
    fontSize: "12px",
    fontFamily: "monospace",
    color: "#ffffff",
    backgroundColor: "#00000088",
    padding: { x: 4, y: 2 }
  }).setOrigin(0.5);

  scene.tweens.add({
    targets: [aboutGroup, chestGroup, mailGroup],
    y: "-=4",
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });

  return { aboutBox, signpost, contactBox };
}
