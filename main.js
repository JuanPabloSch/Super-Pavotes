/* global Phaser, GameScene */

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#000000",
    scene: [GameScene]
};

new Phaser.Game(config);