const DEFAULTS = {
  gravity: 1050,
  maxDrag: 125,
  minimumDrag: 24,
  horizontalPower: 4.2,
  verticalPower: 7.2,
  minimumLift: 900,
  maximumLift: 1050,
  maximumHorizontalSpeed: 420,
  rimHalfWidth: 68,
  rimY: 471,
  boundsPadding: 120,
};

const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

export function calculateLaunchVelocity(origin, pointer, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  let dragX = origin.x - pointer.x;
  let dragY = origin.y - pointer.y;
  const distance = Math.hypot(dragX, dragY);
  if (distance > settings.maxDrag) {
    const scale = settings.maxDrag / distance;
    dragX *= scale;
    dragY *= scale;
  }

  if (distance < settings.minimumDrag || dragY > -12) return null;
  const upwardStrength = clamp(-dragY * settings.verticalPower, settings.minimumLift, settings.maximumLift);
  const horizontalStrength = clamp(dragX * settings.horizontalPower, -settings.maximumHorizontalSpeed, settings.maximumHorizontalSpeed);
  return {
    x: horizontalStrength * 0.2,
    y: -upwardStrength,
    dragDistance: Math.min(distance, settings.maxDrag),
  };
}

export function stepProjectile(position, velocity, deltaSeconds, gravity = DEFAULTS.gravity) {
  return {
    position: {
      x: position.x + velocity.x * deltaSeconds,
      y: position.y + velocity.y * deltaSeconds + 0.5 * gravity * deltaSeconds * deltaSeconds,
    },
    velocity: { x: velocity.x, y: velocity.y + gravity * deltaSeconds },
  };
}

export function crossedScoringPlane(previous, current, velocity, rimCenterX, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  return velocity.y > 0
    && previous.y < settings.rimY
    && current.y >= settings.rimY
    && Math.abs(current.x - rimCenterX) <= settings.rimHalfWidth;
}

export class ManualShootingSystem {
  constructor(scene, ball, callbacks = {}, options = {}) {
    this.scene = scene;
    this.ball = ball;
    this.callbacks = callbacks;
    this.options = { ...DEFAULTS, ...options };
    this.origin = { x: ball.x, y: ball.y };
    this.rimCenterX = options.rimCenterX ?? ball.x;
    this.enabled = false;
    this.dragging = false;
    this.flying = false;
    this.guide = scene.add.graphics().setDepth(29).setVisible(false);
    this.onPointerDown = (pointer) => this.beginDrag(pointer);
    this.onPointerMove = (pointer) => this.updateDrag(pointer);
    this.onPointerUp = (pointer) => this.release(pointer);
    this.onUpdate = (_time, delta) => this.updateFlight(Math.min(delta / 1000, 1 / 30));
    ball.on("pointerdown", this.onPointerDown);
    scene.input.on("pointermove", this.onPointerMove);
    scene.input.on("pointerup", this.onPointerUp);
    scene.events.on("update", this.onUpdate);
    scene.events.once("shutdown", () => this.destroy());
  }

  setOrigin(x, y) {
    this.origin = { x, y };
  }

  enable() {
    if (!this.flying) this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.dragging = false;
    this.guide.clear().setVisible(false);
  }

  beginDrag(pointer) {
    if (!this.enabled || this.flying) return;
    this.dragging = true;
    this.pointer = { x: pointer.worldX, y: pointer.worldY };
    this.guide.setVisible(true);
    this.drawGuide(this.pointer);
    this.callbacks.onAimStart?.();
  }

  updateDrag(pointer) {
    if (!this.dragging) return;
    this.pointer = { x: pointer.worldX, y: pointer.worldY };
    const dx = this.pointer.x - this.origin.x;
    const dy = this.pointer.y - this.origin.y;
    const distance = Math.hypot(dx, dy);
    const scale = distance > this.options.maxDrag ? this.options.maxDrag / distance : 1;
    this.ball.setPosition(this.origin.x + dx * scale * 0.34, this.origin.y + dy * scale * 0.34);
    this.drawGuide(this.pointer);
  }

  release(pointer) {
    if (!this.dragging) return;
    this.dragging = false;
    this.guide.clear().setVisible(false);
    const velocity = calculateLaunchVelocity(this.origin, { x: pointer.worldX, y: pointer.worldY }, this.options);
    if (!velocity) {
      this.ball.setPosition(this.origin.x, this.origin.y);
      this.callbacks.onInvalidRelease?.();
      return;
    }
    this.velocity = velocity;
    this.flying = true;
    this.enabled = false;
    this.ball.setPosition(this.origin.x, this.origin.y);
    this.callbacks.onLaunch?.(velocity);
  }

  updateFlight(deltaSeconds) {
    if (!this.flying) return;
    const previous = { x: this.ball.x, y: this.ball.y };
    const next = stepProjectile(previous, this.velocity, deltaSeconds, this.options.gravity);
    this.velocity = next.velocity;
    this.ball.setPosition(next.position.x, next.position.y);
    const perspective = clamp((this.ball.y - this.options.rimY) / (this.origin.y - this.options.rimY), 0, 1);
    this.ball.setScale(0.7 + perspective * 0.3);
    this.callbacks.onFlightUpdate?.(this.velocity);

    if (crossedScoringPlane(previous, next.position, this.velocity, this.rimCenterX, this.options)) {
      this.flying = false;
      this.callbacks.onScore?.();
      return;
    }

    const outside = this.ball.x < -this.options.boundsPadding
      || this.ball.x > this.scene.scale.width + this.options.boundsPadding
      || this.ball.y > this.scene.scale.height + 80;
    const passedBasket = this.velocity.y > 0 && this.ball.y > this.options.rimY + 245;
    if (outside || passedBasket) {
      this.flying = false;
      this.callbacks.onMiss?.();
    }
  }

  drawGuide(pointer) {
    this.guide.clear();
    const velocity = calculateLaunchVelocity(this.origin, pointer, this.options);
    if (!velocity) return;
    let position = { ...this.origin };
    let previewVelocity = { x: velocity.x, y: velocity.y };
    this.guide.lineStyle(2, 0xffffff, 0.24);
    for (let index = 1; index <= 13; index += 1) {
      const next = stepProjectile(position, previewVelocity, 0.055, this.options.gravity);
      position = next.position;
      previewVelocity = next.velocity;
      const alpha = 0.62 - index * 0.035;
      this.guide.fillStyle(index % 2 === 0 ? 0xffd84f : 0xffffff, Math.max(0.12, alpha));
      this.guide.fillCircle(position.x, position.y, Math.max(2, 5 - index * 0.18));
    }
  }

  reset() {
    this.flying = false;
    this.dragging = false;
    this.velocity = null;
    this.guide.clear().setVisible(false);
    this.ball.setPosition(this.origin.x, this.origin.y).setScale(1);
    this.enabled = true;
  }

  destroy() {
    this.ball?.off("pointerdown", this.onPointerDown);
    this.scene?.input.off("pointermove", this.onPointerMove);
    this.scene?.input.off("pointerup", this.onPointerUp);
    this.scene?.events.off("update", this.onUpdate);
    this.guide?.destroy();
  }
}
