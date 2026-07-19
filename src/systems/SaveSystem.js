const COINS_KEY = "letterQuestHDCoins";
const PROGRESS_KEY = "letterQuestProgress";
const NUMBER_PROGRESS_KEY = "basketballLearningNumberProgress";
const MUTED_KEY = "letterQuestMuted";
const THEME_KEY = "letterQuestTheme";
const ACTIVITY_KEY = "basketballLearningActivity";
const SHOT_MODE_KEY = "basketballLearningShotMode";
const THEMES = ["open-court", "classic-arcade", "pup-arcade"];

function readNumber(key, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = Number(raw);
    if (!Number.isFinite(value)) return fallback;
    return Math.min(max, Math.max(min, Math.floor(value)));
  } catch {
    return fallback;
  }
}

function writeNumber(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

export const SaveSystem = {
  getCoins() {
    return readNumber(COINS_KEY, 0);
  },

  saveCoins(coins) {
    return writeNumber(COINS_KEY, Math.max(0, Math.floor(Number(coins) || 0)));
  },

  getLetterIndex() {
    return readNumber(PROGRESS_KEY, 0, { min: 0, max: 25 });
  },

  saveLetterIndex(index) {
    const safeIndex = ((Math.floor(Number(index) || 0) % 26) + 26) % 26;
    return writeNumber(PROGRESS_KEY, safeIndex);
  },

  getNumberIndex() {
    return readNumber(NUMBER_PROGRESS_KEY, 0, { min: 0, max: 19 });
  },

  saveNumberIndex(index) {
    const safeIndex = ((Math.floor(Number(index) || 0) % 20) + 20) % 20;
    return writeNumber(NUMBER_PROGRESS_KEY, safeIndex);
  },

  getMuted() {
    try {
      return window.localStorage.getItem(MUTED_KEY) === "true";
    } catch {
      return false;
    }
  },

  saveMuted(muted) {
    try {
      window.localStorage.setItem(MUTED_KEY, String(Boolean(muted)));
      return true;
    } catch {
      return false;
    }
  },

  getTheme() {
    try {
      const theme = window.localStorage.getItem(THEME_KEY);
      if (THEMES.includes(theme)) return theme;
      if (theme === "rescue") return "pup-arcade";
      return "open-court";
    } catch {
      return "sunny";
    }
  },

  saveTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, THEMES.includes(theme) ? theme : "open-court");
      return true;
    } catch {
      return false;
    }
  },

  getActivity() {
    try {
      return window.localStorage.getItem(ACTIVITY_KEY) === "numbers" ? "numbers" : "letters";
    } catch {
      return "letters";
    }
  },

  saveActivity(activity) {
    try {
      window.localStorage.setItem(ACTIVITY_KEY, activity === "numbers" ? "numbers" : "letters");
      return true;
    } catch {
      return false;
    }
  },

  getShotMode() {
    try {
      return window.localStorage.getItem(SHOT_MODE_KEY) === "manual" ? "manual" : "automatic";
    } catch {
      return "automatic";
    }
  },

  saveShotMode(mode) {
    try {
      window.localStorage.setItem(SHOT_MODE_KEY, mode === "manual" ? "manual" : "automatic");
      return true;
    } catch {
      return false;
    }
  },

  resetGameProgress() {
    this.saveCoins(0);
    this.saveLetterIndex(0);
    this.saveNumberIndex(0);
  },
};
