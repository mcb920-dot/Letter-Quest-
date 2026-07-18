import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";

export function createConfetti(scene) {
  const colors = [0xff5d73, 0xffd43b, 0x4dabf7, 0x69db7c, 0xb197fc, 0xff922b, 0x38d9a9];
  for (let i = 0; i < 64; i += 1) {
    const particle = scene.add.rectangle(
      BASE_WIDTH / 2 + Phaser.Math.Between(-28, 28), BASE_HEIGHT / 2 + Phaser.Math.Between(-28, 28),
      Phaser.Math.Between(8, 14), Phaser.Math.Between(16, 28), Phaser.Utils.Array.GetRandom(colors),
    ).setDepth(78).setAngle(Phaser.Math.Between(0, 180));
    const distance = Phaser.Math.Between(170, 430);
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    scene.tweens.add({
      targets: particle,
      x: particle.x + Math.cos(angle) * distance,
      y: particle.y + Math.sin(angle) * distance + 160,
      angle: particle.angle + Phaser.Math.Between(360, 1100), alpha: 0,
      duration: Phaser.Math.Between(1050, 1700), ease: "Quad.Out",
      onComplete: () => particle.destroy(),
    });
  }
}

export function createSparkles(scene) {
  for (let i = 0; i < 18; i += 1) {
    const sparkle = scene.add.star(
      BASE_WIDTH / 2 + Phaser.Math.Between(-120, 120),
      BASE_HEIGHT / 2 + Phaser.Math.Between(-150, 150),
      5, 5, 13, 0xffffff, 1,
    ).setDepth(80).setScale(0.12).setAlpha(0);
    scene.tweens.add({
      targets: sparkle, scale: Phaser.Math.FloatBetween(0.75, 1.4), alpha: 1, angle: 180,
      duration: 280, yoyo: true, hold: Phaser.Math.Between(140, 520),
      onComplete: () => sparkle.destroy(),
    });
  }
}
