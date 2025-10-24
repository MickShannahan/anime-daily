export function randomInt(num, maxN) {
  const rangeMin = maxN ? num : 0
  const rangeMax = maxN ? maxN : num
  const min = Math.ceil(Math.min(rangeMin, rangeMax));
  const max = Math.floor(Math.max(rangeMin, rangeMax));
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFromArray(array) {
  if (!array || array.length === 0) {
    throw new Error("Array must not be empty");
  }
  return array[randomInt(0, array.length - 1)];
}