const DEFAULT_SEED = 'drill'

// Internal: create a numeric seed from a string + date (YYYY-MM-DD)
function seedFromStringAndDate(str = '', date = new Date()) {
  // Use only the date (no time)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const dateStr = `${y}-${m}-${d}`;
  const full = `${str}:${dateStr}`;
  // Simple hash to 32-bit int (djb2 variant)
  let h = 5381;
  for (let i = 0; i < full.length; i++) {
    h = ((h << 5) + h) + full.charCodeAt(i); /* h * 33 + c */
    h = h | 0; // force to 32bit
  }
  return h >>> 0; // convert to unsigned
}

// Mulberry32 PRNG - fast, small, decent quality for games/UX
function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Create a PRNG seeded by seedStr and date (Date or string 'YYYY-MM-DD')
function createDailyPRNG(seedStr = DEFAULT_SEED, dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const numericSeed = seedFromStringAndDate(seedStr, date);
  return mulberry32(numericSeed);
}

// Returns a random integer between min and max inclusive using optional daily seed
export function randomInt(num, maxN, options = {}) {
  // Backwards-compatible parameter handling: randomInt(max) or randomInt(min, max)
  const rangeMin = (typeof maxN !== 'undefined') ? num : 0;
  const rangeMax = (typeof maxN !== 'undefined') ? maxN : num;
  const min = Math.ceil(Math.min(rangeMin, rangeMax));
  const max = Math.floor(Math.max(rangeMin, rangeMax));
  if (min > max) return NaN;

  // Determine seed behavior:
  // - If options.seed is omitted: use DEFAULT_SEED (deterministic per-day)
  // - If options.seed === null or === false: opt-out to Math.random (non-deterministic)
  const hasSeedProp = Object.prototype.hasOwnProperty.call(options, 'seed');
  if (hasSeedProp && (options.seed === null || options.seed === false)) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const seedToUse = hasSeedProp ? options.seed : DEFAULT_SEED;
  const prng = createDailyPRNG(seedToUse, options.date);
  const r = prng();
  return Math.floor(r * (max - min + 1)) + min;
}

// Returns a random float in [0,1) or within [min,max) if provided. Accepts options.seed and options.date
export function randomFloat(options = {}) {
  const min = (typeof options.min === 'number') ? options.min : 0;
  const max = (typeof options.max === 'number') ? options.max : 1;
  if (min >= max) return NaN;

  const hasSeedProp = Object.prototype.hasOwnProperty.call(options, 'seed');
  if (hasSeedProp && (options.seed === null || options.seed === false)) {
    return Math.random() * (max - min) + min;
  }

  const seedToUse = hasSeedProp ? options.seed : DEFAULT_SEED;
  const prng = createDailyPRNG(seedToUse, options.date);
  return prng() * (max - min) + min;
}

// Return a single random item from array. Accepts options.seed and options.date
export function randomFromArray(array, options = {}) {
  if (!array || array.length === 0) {
    throw new Error('Array must not be empty');
  }
  const hasSeedProp = Object.prototype.hasOwnProperty.call(options, 'seed');
  if (hasSeedProp && (options.seed === null || options.seed === false)) {
    return array[randomInt(0, array.length - 1)];
  }
  const seedToUse = hasSeedProp ? options.seed : DEFAULT_SEED;
  const prng = createDailyPRNG(seedToUse, options.date);
  const idx = Math.floor(prng() * array.length);
  return array[idx];
}

// Return n unique (if possible) items from array. If n >= array.length, returns shuffled copy of array.
// options.seed and options.date control determinism. If no seed provided, uses random shuffle via Math.random.
export function randomFromArrayMultiple(array, n = 1, options = {}) {
  if (!array || array.length === 0) {
    throw new Error('Array must not be empty');
  }
  const count = Math.max(0, Math.floor(n));
  if (count === 0) return [];

  // Make a shallow copy
  const copy = array.slice();

  // Choose PRNG
  let randFunc;
  const hasSeedProp = Object.prototype.hasOwnProperty.call(options, 'seed');
  if (hasSeedProp && (options.seed === null || options.seed === false)) {
    randFunc = () => Math.random();
  } else {
    const seedToUse = hasSeedProp ? options.seed : DEFAULT_SEED;
    const prng = createDailyPRNG(seedToUse, options.date);
    randFunc = () => prng();
  }

  // Fisher-Yates shuffle (stop early once we've selected enough)
  for (let i = copy.length - 1; i > 0 && (copy.length - i) <= count; i--) {
    const j = Math.floor(randFunc() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }

  if (count >= copy.length) return copy;
  // Return last 'count' items (they've been shuffled into the end)
  return copy.slice(copy.length - count);
}