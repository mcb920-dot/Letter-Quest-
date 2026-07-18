export function createBasketballTexture(scene) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const cx = size / 2;
  const cy = size / 2;
  const radius = 226;

  const gradient = ctx.createRadialGradient(cx - 85, cy - 95, 20, cx, cy, radius);
  gradient.addColorStop(0, "#ffd28c");
  gradient.addColorStop(0.2, "#ffad4f");
  gradient.addColorStop(0.55, "#f47b2e");
  gradient.addColorStop(0.82, "#d64d1f");
  gradient.addColorStop(1, "#7e250f");
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.shadowColor = "rgba(0,0,0,.42)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  for (let y = 30; y < size - 30; y += 7) {
    for (let x = 30; x < size - 30; x += 7) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy < radius * radius) {
        ctx.beginPath();
        ctx.arc(x + (Math.random() - 0.5) * 2.4, y + (Math.random() - 0.5) * 2.4, 1.15, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,220,160,.22)" : "rgba(80,20,5,.18)";
        ctx.fill();
      }
    }
  }

  const shade = ctx.createRadialGradient(cx + 70, cy + 95, 25, cx + 70, cy + 95, 235);
  shade.addColorStop(0, "rgba(40,8,2,0)");
  shade.addColorStop(0.75, "rgba(40,8,2,.08)");
  shade.addColorStop(1, "rgba(20,4,1,.42)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "#54210f";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - radius, cy);
  ctx.bezierCurveTo(cx - 70, cy - 30, cx + 70, cy + 30, cx + radius, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.bezierCurveTo(cx - 35, cy - 100, cx + 35, cy + 100, cx, cy + radius);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.72, cy - radius * 0.72);
  ctx.bezierCurveTo(cx - 35, cy - 65, cx - 35, cy + 65, cx - radius * 0.72, cy + radius * 0.72);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + radius * 0.72, cy - radius * 0.72);
  ctx.bezierCurveTo(cx + 35, cy - 65, cx + 35, cy + 65, cx + radius * 0.72, cy + radius * 0.72);
  ctx.stroke();

  const highlight = ctx.createRadialGradient(cx - 100, cy - 112, 4, cx - 100, cy - 112, 92);
  highlight.addColorStop(0, "rgba(255,255,255,.55)");
  highlight.addColorStop(0.35, "rgba(255,255,255,.18)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();
  scene.textures.addCanvas("basketballHD", canvas);
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
