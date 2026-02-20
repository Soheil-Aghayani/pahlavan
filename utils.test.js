import test from 'node:test';
import assert from 'node:assert';
import { clickZone, fmtTime, getParticleCount } from './utils.js';

test('clickZone - right zone boundary', () => {
  const rect = { left: 0, width: 100 };

  // Well inside right zone
  assert.strictEqual(clickZone({ clientX: 70 }, rect), 'right');

  // Just above 68%
  assert.strictEqual(clickZone({ clientX: 68.01 }, rect), 'right');

  // Exactly 68% -> should be middle
  assert.strictEqual(clickZone({ clientX: 68 }, rect), 'middle');

  // Just below 68%
  assert.strictEqual(clickZone({ clientX: 67.99 }, rect), 'middle');
});

test('clickZone - left zone boundary', () => {
  const rect = { left: 0, width: 100 };

  // Well inside left zone
  assert.strictEqual(clickZone({ clientX: 30 }, rect), 'left');

  // Just below 32%
  assert.strictEqual(clickZone({ clientX: 31.99 }, rect), 'left');

  // Exactly 32% -> should be middle
  assert.strictEqual(clickZone({ clientX: 32 }, rect), 'middle');

  // Just above 32%
  assert.strictEqual(clickZone({ clientX: 32.01 }, rect), 'middle');
});

test('clickZone - middle zone', () => {
  const rect = { left: 0, width: 100 };

  assert.strictEqual(clickZone({ clientX: 50 }, rect), 'middle');
});

test('clickZone - with non-zero rect.left', () => {
  const rect = { left: 10, width: 100 };

  // x = 80 - 10 = 70 (> 68)
  assert.strictEqual(clickZone({ clientX: 80 }, rect), 'right');

  // x = 40 - 10 = 30 (< 32)
  assert.strictEqual(clickZone({ clientX: 40 }, rect), 'left');

  // x = 60 - 10 = 50 (middle)
  assert.strictEqual(clickZone({ clientX: 60 }, rect), 'middle');
});

test('clickZone - edge cases', () => {
  const rect = { left: 0, width: 100 };

  // Extreme left
  assert.strictEqual(clickZone({ clientX: 0 }, rect), 'left');

  // Extreme right
  assert.strictEqual(clickZone({ clientX: 100 }, rect), 'right');

  // Zero width
  const zeroRect = { left: 0, width: 0 };
  assert.strictEqual(clickZone({ clientX: 0 }, zeroRect), 'middle');
  assert.strictEqual(clickZone({ clientX: 1 }, zeroRect), 'right');
  assert.strictEqual(clickZone({ clientX: -1 }, zeroRect), 'left');
});

test('fmtTime - basic functionality', () => {
  assert.strictEqual(fmtTime(0), '0:00');
  assert.strictEqual(fmtTime(5), '0:05');
  assert.strictEqual(fmtTime(60), '1:00');
  assert.strictEqual(fmtTime(65), '1:05');
  assert.strictEqual(fmtTime(3600), '60:00');
});

test('fmtTime - edge cases', () => {
  assert.strictEqual(fmtTime(-1), '0:00');
  assert.strictEqual(fmtTime(NaN), '0:00');
  assert.strictEqual(fmtTime(Infinity), '0:00');
});

test('getParticleCount - basic calculation', () => {
  // 1400 * 1000 = 1400000. 1400000 / 14000 = 100.
  assert.strictEqual(getParticleCount(1400, 1000), 100);

  // 1400 * 100 = 140000. 140000 / 14000 = 10. Max(90, 10) = 90.
  assert.strictEqual(getParticleCount(1400, 100), 90);
});

test('getParticleCount - minimum value', () => {
  assert.strictEqual(getParticleCount(0, 0), 90);
  assert.strictEqual(getParticleCount(10, 10), 90);
});

test('getParticleCount - rounding', () => {
  // 1267000 / 14000 = 90.5 -> rounds to 91
  // Area = 1267000.
  // e.g. 1267 * 1000
  assert.strictEqual(getParticleCount(1267, 1000), 91);
});
