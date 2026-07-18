const COINS_KEY = "letterQuestHDCoins";
const PROGRESS_KEY = "letterQuestProgress";
const MUTED_KEY = "letterQuestMuted";

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
};
