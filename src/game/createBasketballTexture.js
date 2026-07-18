export const BASKETBALL_SPIN_FRAMES = 10;

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
  for (let y = 34; y < size - 34; y += 5) {
    for (let x = 34; x < size - 34; x += 5) {
      const dx = x - center;
      const dy = y - center;
      if (dx * dx + dy * dy >= (radius - 5) ** 2) continue;
      const lightFacing = Math.max(0, 1 - Math.hypot(dx + 80, dy + 90) / 340);
      ctx.beginPath();
      ctx.ellipse(x + Math.sin(x * 0.19 + y) * 0.65, y + Math.cos(y * 0.17 + x) * 0.65, 0.9, 0.72, 0, 0, Math.PI * 2);
      ctx.fillStyle = lightFacing > 0.45 ? "rgba(255,225,165,.19)" : "rgba(61,13,4,.24)";
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
  highlight.addColorStop(0, "rgba(255,255,255,.44)");
  highlight.addColorStop(0.34, "rgba(255,255,255,.16)");
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
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = "#3d160c";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const rotation = progress * Math.PI * 2;
  const normals = [
    [1, 0, 0],
    [0, 1, 0],
    [Math.sin(0.88), Math.cos(0.88), 0],
    [Math.sin(-0.88), Math.cos(-0.88), 0],
  ];
  for (const normal of normals) drawGreatCircle(ctx, normal, rotation, center, radius);
  ctx.restore();
  return canvas;
}

function drawGreatCircle(ctx, normal, rotation, center, radius) {
  const reference = Math.abs(normal[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0];
  const first = normalize(cross(normal, reference));
  const second = cross(normal, first);
  let drawing = false;
  ctx.beginPath();
  for (let step = 0; step <= 180; step += 1) {
    const angle = (step / 180) * Math.PI * 2;
    const x = first[0] * Math.cos(angle) + second[0] * Math.sin(angle);
    const y = first[1] * Math.cos(angle) + second[1] * Math.sin(angle);
    const z = first[2] * Math.cos(angle) + second[2] * Math.sin(angle);
    const rotatedY = y * Math.cos(rotation) - z * Math.sin(rotation);
    const rotatedZ = y * Math.sin(rotation) + z * Math.cos(rotation);
    if (rotatedZ > 0.015) {
      const px = center + x * radius;
      const py = center + rotatedY * radius;
      if (!drawing) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      drawing = true;
    } else {
      drawing = false;
    }
  }
  ctx.stroke();
}

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function normalize(vector) {
  const length = Math.hypot(...vector) || 1;
  return vector.map((value) => value / length);
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
