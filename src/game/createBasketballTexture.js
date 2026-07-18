export const BASKETBALL_SPIN_FRAMES = 12;

export function createBasketballTexture(scene) {
  const sphere = createSphereCanvas();
  scene.textures.addCanvas("basketballSphere", sphere);

  const seamFrames = [];
  for (let frame = 0; frame < BASKETBALL_SPIN_FRAMES; frame += 1) {
    const seams = createSeamCanvas(frame / BASKETBALL_SPIN_FRAMES);
    seamFrames.push(seams);
    scene.textures.addCanvas(`basketballSeams${frame}`, seams);
  }

  // Static composite retained for the decorative menu basketball.
  const composite = document.createElement("canvas");
  composite.width = composite.height = 512;
  const compositeContext = composite.getContext("2d");
  compositeContext.drawImage(sphere, 0, 0);
  compositeContext.drawImage(seamFrames[0], 0, 0);
  scene.textures.addCanvas("basketballHD", composite);
}

function createSphereCanvas() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;
  const radius = 224;

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.shadowColor = "rgba(0,0,0,.48)";
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 13;
  const base = ctx.createRadialGradient(center - 92, center - 105, 18, center + 18, center + 18, radius * 1.08);
  base.addColorStop(0, "#ffd797");
  base.addColorStop(0.18, "#ffaf55");
  base.addColorStop(0.5, "#f47a2e");
  base.addColorStop(0.78, "#c9491e");
  base.addColorStop(1, "#70200f");
  ctx.fillStyle = base;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, radius - 2, 0, Math.PI * 2);
  ctx.clip();

  // Fixed leather pebbling reinforces the spherical surface without spinning the lighting.
  for (let y = 34; y < size - 34; y += 7) {
    for (let x = 34; x < size - 34; x += 7) {
      const dx = x - center;
      const dy = y - center;
      if (dx * dx + dy * dy >= (radius - 5) ** 2) continue;
      const lightFacing = Math.max(0, 1 - Math.hypot(dx + 80, dy + 90) / 340);
      ctx.beginPath();
      ctx.arc(x + Math.sin(x * 0.19 + y) * 0.9, y + Math.cos(y * 0.17 + x) * 0.9, 1.15, 0, Math.PI * 2);
      ctx.fillStyle = lightFacing > 0.45 ? "rgba(255,231,180,.25)" : "rgba(69,16,5,.2)";
      ctx.fill();
    }
  }

  const lowerShade = ctx.createRadialGradient(center + 82, center + 102, 20, center + 82, center + 102, 250);
  lowerShade.addColorStop(0, "rgba(36,7,2,0)");
  lowerShade.addColorStop(0.62, "rgba(36,7,2,.08)");
  lowerShade.addColorStop(1, "rgba(19,3,1,.48)");
  ctx.fillStyle = lowerShade;
  ctx.fillRect(0, 0, size, size);

  const highlight = ctx.createRadialGradient(center - 105, center - 118, 3, center - 105, center - 118, 102);
  highlight.addColorStop(0, "rgba(255,255,255,.62)");
  highlight.addColorStop(0.28, "rgba(255,255,255,.23)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(center, center, radius - 5, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(76,22,9,.9)";
  ctx.lineWidth = 11;
  ctx.stroke();
  return canvas;
}

function createSeamCanvas(progress) {
  const size = 512;
  const center = size / 2;
  const radius = 216;
  const phase = progress * Math.PI * 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "#54200f";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Moving projected great circles: their curvature and position change per frame.
  const drift = Math.sin(phase) * 88;
  const bend = Math.cos(phase) * 122;
  ctx.beginPath();
  ctx.moveTo(center + drift * 0.22, center - radius);
  ctx.bezierCurveTo(center + drift + bend, center - 95, center + drift - bend, center + 95, center + drift * 0.22, center + radius);
  ctx.stroke();

  const secondPhase = phase + Math.PI / 2;
  const driftTwo = Math.sin(secondPhase) * 132;
  const bendTwo = Math.cos(secondPhase) * 76;
  ctx.beginPath();
  ctx.moveTo(center - radius * 0.72, center - radius * 0.7 + driftTwo * 0.16);
  ctx.bezierCurveTo(center - 82, center + driftTwo + bendTwo, center + 82, center + driftTwo - bendTwo, center + radius * 0.72, center + radius * 0.7 + driftTwo * 0.16);
  ctx.stroke();

  const equatorLift = Math.sin(phase + Math.PI * 0.3) * 48;
  const equatorTilt = Math.cos(phase) * 34;
  ctx.beginPath();
  ctx.moveTo(center - radius, center + equatorLift - equatorTilt);
  ctx.bezierCurveTo(center - 70, center + equatorLift + 30, center + 70, center + equatorLift - 30, center + radius, center + equatorLift + equatorTilt);
  ctx.stroke();

  // A faint near-side seam highlight gives the channels physical depth.
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = "#ffb060";
  ctx.lineWidth = 3;
  ctx.translate(-3, -3);
  ctx.stroke();
  ctx.restore();
  return canvas;
}

export function createSoftGlowTexture(scene) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(200, 170, 30, 256, 256, 230);
  gradient.addColorStop(0, "rgba(255,255,255,.95)");
  gradient.addColorStop(0.25, "rgba(255,255,255,.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  scene.textures.addCanvas("softGlow", canvas);
}
