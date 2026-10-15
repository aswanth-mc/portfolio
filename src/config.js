import GameScene from "./scenes/gameScene.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 650 },
      debug: false
    }
  },
  scene: [GameScene]
};

export default config;
