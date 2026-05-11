/**
 * Application configuration.
 *
 * This is the only file you need to edit to add, remove, or change media types
 * and the volume range. The app re-derives the question pool from these values
 * on every load, so the footer's variation count stays in sync automatically.
 *
 * Each entry in `MEDIA` is a dehydrated medium and its manufacturer-recommended
 * dilution in grams per liter of finished solution.
 *
 *   name:   Lowercase string used directly in the problem text.
 *           Use the spelling/capitalization you want students to see, except
 *           for the first letter — the app capitalizes it at the start of
 *           a sentence.
 *   gPerL:  Grams of dehydrated powder per 1 L of finished medium.
 *
 * Verify these values against your own manufacturer's label before lab use.
 */
export const MEDIA = [
  { name: 'nutrient agar',      gPerL: 23  },
  { name: 'tryptic soy agar',   gPerL: 40  },
  { name: 'citrate agar',       gPerL: 24  },
  { name: 'MacConkey agar',     gPerL: 50  },
  { name: 'mannitol salt agar', gPerL: 111 }
];

/**
 * Common classroom volumes (mL). These are the "clean" volumes that students
 * encounter most often in lab.
 */
export const COMMON_VOLUMES_ML = [
  100, 150, 200, 250, 300, 400, 500, 600, 750, 1000, 1500, 2000
];

/**
 * Probability (0..1) that a generated question uses a value from
 * COMMON_VOLUMES_ML. The remainder are drawn uniformly from the random range
 * below, snapped to RANDOM_STEP_ML.
 */
export const COMMON_VOLUME_PROBABILITY = 0.75;

/** Random volume range (mL), inclusive, snapped to RANDOM_STEP_ML. */
export const RANDOM_MIN_ML  = 100;
export const RANDOM_MAX_ML  = 2000;
export const RANDOM_STEP_ML = 5;

/** Allowed error when grading a student's answer, in grams. */
export const ANSWER_TOLERANCE_G = 0.02;

/** Number of attempts per question before the solution is revealed. */
export const ATTEMPTS_PER_QUESTION = 3;
