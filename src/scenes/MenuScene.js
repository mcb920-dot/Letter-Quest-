import Phaser from "phaser";
import { BASE_HEIGHT, BASE_WIDTH } from "../config/gameConfig.js";
import { SaveSystem } from "../systems/SaveSystem.js";

const FONT = "Arial Rounded MT Bold, Arial";
const COURTS = [
  { key: "open-court", label: "OPEN COURT" },
  { key: "classic-arcade", label: "CLASSIC" },
  { key: "pup-arcade", label: "PUP ARCADE" },
];

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.audioSystem = this.registry.get("audioSystem");
    this.screen = this.add.container(0, 0);
    this.showActivityMenu();
  }

  clearScreen() {
    this.screen.removeAll(true);
  }

  addBackground(theme = "classic-arcade") {
    const background = this.add.image(BASE_WIDTH / 2, BASE_HEIGHT / 2, `${theme}-background`)
      .setDisplaySize(BASE_WIDTH, BASE_HEIGHT);
    const shade = this.add.rectangle(BASE_WIDTH / 2, BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT, 0x06122f, 0.48);
    this.screen.add([background, shade]);
  }

  addLogo(y = 128, width = 480) {
    const logo = this.add.image(BASE_WIDTH / 2, y, "basketballLearningLogo")
      .setDisplaySize(width, width / 2);
    this.screen.add(logo);
  }

  addPanel(x, y, width, height, selected = false) {
    const glow = this.add.rectangle(x, y + 8, width, height, 0x000000, 0.35).setOrigin(0.5);
    const panel = this.add.rectangle(x, y, width, height, 0x0d3476, 0.96)
      .setStrokeStyle(selected ? 6 : 3, selected ? 0xffd54a : 0x59dfff, 1);
    this.screen.add([glow, panel]);
    return panel;
  }

  addArcadeButton(x, y, width, height, label, onPress, color = 0xff5a67) {
    const shadow = this.add.rectangle(x, y + 7, width, height, 0x68162b, 0.9).setOrigin(0.5);
    const button = this.add.rectangle(x, y, width, height, color, 1)
      .setStrokeStyle(4, 0xffe49b, 1)
      .setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, {
      fontFamily: FONT, fontSize: "22px", fontStyle: "bold", color: "#ffffff",
      stroke: "#76213b", strokeThickness: 4, align: "center",
    }).setOrigin(0.5);
    button.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.playEffect("tap");
      this.tweens.add({ targets: [button, text], scale: 0.96, duration: 65, yoyo: true, onComplete: onPress });
    });
    this.screen.add([shadow, button, text]);
    return button;
  }

  showActivityMenu() {
    this.clearScreen();
    this.addBackground("classic-arcade");
    this.addLogo(135, 500);
    this.screen.add(this.add.text(BASE_WIDTH / 2, 270, "WHAT DO YOU WANT TO LEARN?", {
      fontFamily: FONT, fontSize: "19px", fontStyle: "bold", color: "#ffffff",
      stroke: "#102a63", strokeThickness: 5,
    }).setOrigin(0.5));

    this.createActivityCard(150, "letters", "LETTERS", "A – Z", "A", "#ff6b65");
    this.createActivityCard(390, "numbers", "NUMBERS", "1 – 20", "123", "#ffd43b");
    this.addSoundControl();
  }

  createActivityCard(x, activity, title, subtitle, symbol, accent) {
    const panel = this.addPanel(x, 525, 210, 400);
    const preview = this.add.image(x, 475, activity === "letters" ? "open-court-background" : "pup-arcade-background")
      .setDisplaySize(184, 270);
    const veil = this.add.rectangle(x, 475, 184, 270, 0x09225a, 0.25);
    const ball = this.add.image(x, 493, "premiumBasketball").setDisplaySize(126, 126);
    const symbolText = this.add.text(x, 493, symbol, {
      fontFamily: FONT, fontSize: activity === "letters" ? "52px" : "31px", fontStyle: "bold",
      color: "#ffffff", stroke: "#6f2819", strokeThickness: 7,
    }).setOrigin(0.5);
    const titleText = this.add.text(x, 340, title, {
      fontFamily: FONT, fontSize: "25px", fontStyle: "bold", color: accent,
      stroke: "#071a45", strokeThickness: 5,
    }).setOrigin(0.5);
    const subtitleText = this.add.text(x, 683, subtitle, {
      fontFamily: FONT, fontSize: "20px", fontStyle: "bold", color: "#ffffff",
    }).setOrigin(0.5);
    panel.setInteractive({ useHandCursor: true });
    panel.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.playEffect("tap");
      SaveSystem.saveActivity(activity);
      this.showCourtMenu();
    });
    this.screen.add([preview, veil, ball, symbolText, titleText, subtitleText]);
  }

  showCourtMenu() {
    this.clearScreen();
    this.addBackground(SaveSystem.getTheme());
    this.addLogo(112, 445);
    const activity = SaveSystem.getActivity();
    this.screen.add(this.add.text(BASE_WIDTH / 2, 225, activity === "letters" ? "LETTERS  •  A–Z" : "NUMBERS  •  1–20", {
      fontFamily: FONT, fontSize: "19px", fontStyle: "bold", color: "#ffd94a",
      stroke: "#102a63", strokeThickness: 5,
    }).setOrigin(0.5));
    this.screen.add(this.add.text(BASE_WIDTH / 2, 275, "CHOOSE YOUR COURT", {
      fontFamily: FONT, fontSize: "17px", fontStyle: "bold", color: "#ffffff",
      stroke: "#102a63", strokeThickness: 5,
    }).setOrigin(0.5));

    this.themeControls = COURTS.map((court, index) => this.createCourtCard(court, 99 + index * 171));
    this.updateCourtSelection();
    const playLabel = activity === "letters" ? "PLAY LETTERS" : "PLAY NUMBERS";
    this.addArcadeButton(BASE_WIDTH / 2, 820, 350, 74, playLabel, () => {
      this.audioSystem.startMusic();
      this.cameras.main.flash(90, 255, 255, 255, false);
      this.time.delayedCall(75, () => this.scene.start("LearnLettersScene"));
    });
    this.addArcadeButton(66, 55, 74, 52, "‹", () => this.showActivityMenu(), 0x4b2a99);
    this.addSoundControl();
  }

  createCourtCard(court, x) {
    const panel = this.addPanel(x, 510, 152, 420);
    const preview = this.add.image(x, 495, `${court.key}-background`).setDisplaySize(136, 350);
    const labelBack = this.add.rectangle(x, 682, 136, 50, 0x081b46, 0.94);
    const label = this.add.text(x, 682, court.label, {
      fontFamily: FONT, fontSize: "12px", fontStyle: "bold", color: "#ffffff", align: "center",
    }).setOrigin(0.5);
    panel.setInteractive({ useHandCursor: true });
    panel.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.playEffect("tap");
      SaveSystem.saveTheme(court.key);
      this.showCourtMenu();
    });
    this.screen.add([preview, labelBack, label]);
    return { key: court.key, panel };
  }

  updateCourtSelection() {
    const selected = SaveSystem.getTheme();
    for (const control of this.themeControls) {
      const active = control.key === selected;
      control.panel.setStrokeStyle(active ? 6 : 3, active ? 0xffd54a : 0x59dfff, 1);
    }
  }

  addSoundControl() {
    const background = this.add.circle(BASE_WIDTH / 2, 920, 28, 0xffffff, 0.94)
      .setStrokeStyle(3, 0x59dfff, 0.9)
      .setInteractive({ useHandCursor: true });
    const label = this.add.text(BASE_WIDTH / 2, 920, this.audioSystem.isMuted() ? "🔇" : "🔊", {
      fontFamily: "Arial", fontSize: "21px", color: "#111735",
    }).setOrigin(0.5);
    background.on("pointerdown", () => {
      this.audioSystem.unlock();
      this.audioSystem.toggleMuted();
      label.setText(this.audioSystem.isMuted() ? "🔇" : "🔊");
    });
    this.screen.add([background, label]);
  }
}
