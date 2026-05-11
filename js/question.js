import {
  MEDIA,
  COMMON_VOLUMES_ML,
  COMMON_VOLUME_PROBABILITY,
  RANDOM_MIN_ML,
  RANDOM_MAX_ML,
  RANDOM_STEP_ML
} from './config.js';
import { pickRandom, shortId } from './utils.js';

function pickVolume() {
  if (Math.random() < COMMON_VOLUME_PROBABILITY) {
    return pickRandom(COMMON_VOLUMES_ML);
  }
  const range = (RANDOM_MAX_ML - RANDOM_MIN_ML) / RANDOM_STEP_ML;
  const steps = Math.floor(Math.random() * (range + 1));
  return RANDOM_MIN_ML + steps * RANDOM_STEP_ML;
}

export function generateQuestion() {
  const media = pickRandom(MEDIA);
  const volumeMl = pickVolume();
  const answer = (media.gPerL * volumeMl) / 1000;
  return { media, volumeMl, answer, id: shortId() };
}

/** Size of the question pool given the current config — used in the footer. */
export function questionPoolSize() {
  const volumeCount = ((RANDOM_MAX_ML - RANDOM_MIN_ML) / RANDOM_STEP_ML) + 1;
  return { volumeCount, mediaCount: MEDIA.length, total: volumeCount * MEDIA.length };
}
