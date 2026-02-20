export function clickZone(e, rect) {
  const x = e.clientX - rect.left;
  if (x > rect.width * 0.68) return "right";
  if (x < rect.width * 0.32) return "left";
  return "middle";
}

export function fmtTime(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

export function getParticleCount(width, height) {
  return Math.max(90, Math.round((width * height) / 14000));
}
