import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";

export function createConfetti(scene) {
  const colors = [0xff5d73, 0xffd43b, 0x4dabf7, 0x69db7c, 0xb197fc, 0xff922b, 0x38d9a9];
  for (let i = 0; i < 90; i += 1) {
    const cannon = i % 3;
    const originX = cannon === 0 ? BASE_WIDTH / 2 : cannon === 1 ? 45 : BASE_WIDTH - 45;
    const originY = cannon === 0 ? BASE_HEIGHT / 2 : BASE_HEIGHT - 115;
    const particle = scene.add.rectangle(
      originX + Phaser.Math.Between(-18, 18), originY + Phaser.Math.Between(-18, 18),
      Phaser.Math.Between(8, 14), Phaser.Math.Between(16, 28), Phaser.Utils.Array.GetRandom(colors),
    ).setDepth(78).setAngle(Phaser.Math.Between(0, 180)).setScale(0.35);
    const direction = cannon === 1 ? -1.05 : cannon === 2 ? -2.1 : Phaser.Math.FloatBetween(-2.85, -0.3);
    const distance = Phaser.Math.Between(220, 480);
    scene.tweens.add({
      targets: particle,
      x: particle.x + Math.cos(direction) * distance,
      y: particle.y + Math.sin(direction) * distance + Phaser.Math.Between(100, 230),
      scale: 1,
      angle: particle.angle + Phaser.Math.Between(360, 1100), alpha: 0,
      duration: Phaser.Math.Between(720, 1250), ease: "Cubic.Out",
      onComplete: () => particle.destroy(),
    });
  }
}

export function createImpactBurst(scene) {
  const centerX = BASE_WIDTH / 2;
  const centerY = BASE_HEIGHT / 2;
  const flash = scene.add.circle(centerX, centerY, 72, 0xfff3a0, 0.85)
    .setDepth(77).setScale(0.15).setBlendMode(Phaser.BlendModes.ADD);
  scene.tweens.add({
    targets: flash, scale: 4.2, alpha: 0, duration: 430, ease: "Cubic.Out",
    onComplete: () => flash.destroy(),
  });

  [0x59ddff, 0xffd43b].forEach((color, index) => {
    const ring = scene.add.circle(centerX, centerY, 78, 0xffffff, 0)
      .setStrokeStyle(8 - index * 2, color, 0.95)
      .setDepth(79)
      .setScale(0.25);
    scene.tweens.add({
      targets: ring, scale: 2.5 + index * 0.55, alpha: 0,
      duration: 520 + index * 120, delay: index * 45, ease: "Cubic.Out",
      onComplete: () => ring.destroy(),
    });
  });

  for (let index = 0; index < 16; index += 1) {
    const angle = (Math.PI * 2 * index) / 16;
    const star = scene.add.star(centerX, centerY, 5, 6, 17, index % 2 ? 0xffd43b : 0xffffff, 1)
      .setDepth(81).setScale(0.25).setAngle(Phaser.Math.Between(-30, 30));
    const distance = 130 + (index % 3) * 32;
    scene.tweens.add({
      targets: star,
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      scale: 1.05,
      angle: star.angle + 220,
      alpha: 0,
      duration: 520,
      ease: "Back.Out",
      onComplete: () => star.destroy(),
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
