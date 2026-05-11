/** Lightweight helpers shared across modules. */

export const $ = (id) => document.getElementById(id);

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Display volume: < 1000 mL → "X mL"; ≥ 1000 mL → "X L" (with up to 3 decimals).
export function formatVolume(mL) {
  if (mL >= 1000) {
    const liters = mL / 1000;
    const str = (Math.round(liters * 1000) / 1000).toString();
    return str + ' L';
  }
  return mL + ' mL';
}

export function fmtInt(n) {
  return String(Math.round(n));
}

// Two decimal places (final answers).
export function fmt2(n) {
  return (Math.round(n * 100) / 100).toFixed(2);
}

// Up to 3 decimals, trailing zeros trimmed (intermediates).
export function fmtRaw(n) {
  const rounded = Math.round(n * 1000) / 1000;
  return rounded.toString();
}

export function shortId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 3; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'MP-' + s;
}
