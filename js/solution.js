import { formatVolume, fmtInt, fmt2, fmtRaw } from './utils.js';

// Visual fraction: numerator over denominator with a horizontal bar.
function frac(num, den) {
  return '<span class="frac"><span class="num">' + num +
         '</span><span class="den">' + den + '</span></span>';
}

// Block-level equation row with an ARIA description for screen readers.
function eqLine(content, ariaLabel, highlight) {
  const cls = 'equation' + (highlight ? ' highlight' : '');
  return '<div class="' + cls + '" role="math" aria-label="' + ariaLabel + '">' +
         content + '</div>';
}

// Visual operator spans (hidden from screen readers; aria-label carries meaning).
const EQ     = '<span class="eq-op" aria-hidden="true">=</span>';
const APPROX = '<span class="eq-op" aria-hidden="true">≈</span>';
const TIMES  = '<span class="eq-op" aria-hidden="true">×</span>';

function getShortcut(volumeMl, gPerL) {
  switch (volumeMl) {
    case 100: {
      const result = fmt2(gPerL / 10);
      return {
        title: 'Shortcut for 100 mL',
        description: '100 mL is one-tenth of a liter, so just move the decimal point one place to the left of the per-liter amount.',
        html: gPerL + ' g <span class="eq-op" aria-hidden="true">→</span> <strong>' + result + ' g</strong>',
        aria: gPerL + ' grams becomes ' + result + ' grams'
      };
    }
    case 250: {
      const result = fmt2(gPerL / 4);
      return {
        title: 'Shortcut for 250 mL',
        description: '250 mL is one-quarter of a liter, so divide the per-liter amount by 4.',
        html: frac(gPerL + ' g', '4') + ' ' + EQ + ' <strong>' + result + ' g</strong>',
        aria: gPerL + ' grams divided by 4 equals ' + result + ' grams'
      };
    }
    case 500: {
      const result = fmt2(gPerL / 2);
      return {
        title: 'Shortcut for 500 mL',
        description: '500 mL is half a liter, so divide the per-liter amount by 2.',
        html: frac(gPerL + ' g', '2') + ' ' + EQ + ' <strong>' + result + ' g</strong>',
        aria: gPerL + ' grams divided by 2 equals ' + result + ' grams'
      };
    }
    case 2000: {
      const result = fmt2(gPerL * 2);
      return {
        title: 'Shortcut for 2 L',
        description: '2 L is twice the standard recipe, so multiply the per-liter amount by 2.',
        html: gPerL + ' g ' + TIMES + ' 2 ' + EQ + ' <strong>' + result + ' g</strong>',
        aria: gPerL + ' grams times 2 equals ' + result + ' grams'
      };
    }
    default:
      return null;
  }
}

export function buildSolutionHTML(q) {
  const { media, volumeMl } = q;
  const gPerL = media.gPerL;
  const showAsLiters = volumeMl >= 1000;
  const volLStr = showAsLiters ? formatVolume(volumeMl).replace(' L', '') : null;

  const product = volumeMl * gPerL;
  const rawAnswer = product / 1000;
  const finalAnswer = fmt2(rawAnswer);
  const rawAnswerStr = fmtRaw(rawAnswer);
  const needsRounding = rawAnswerStr !== finalAnswer &&
                        Math.abs(rawAnswer - parseFloat(finalAnswer)) > 1e-9;

  let html = '<h4>Ratio &amp; proportion method</h4>';
  html += '<p>Set up a proportion comparing the unknown mass to the desired volume against the recipe ratio (grams per liter), then solve for x.</p>';
  html += '<ol class="solution-steps">';

  if (showAsLiters) {
    html += '<li>';
    html += '<p class="step-text">Convert ' + volLStr + ' L to milliliters so the units in the proportion will match:</p>';
    html += eqLine(
      volLStr + ' L ' + TIMES + ' ' + frac('1000 mL', '1 L') + ' ' + EQ +
      ' <strong>' + volumeMl + ' mL</strong>',
      volLStr + ' liters times 1000 milliliters per 1 liter equals ' + volumeMl + ' milliliters'
    );
    html += '</li>';
  }

  html += '<li>';
  html += '<p class="step-text">Set up the proportion using the recipe ratio of <strong>' +
          gPerL + ' g per 1 L</strong>:</p>';
  html += eqLine(
    frac('x g', volumeMl + ' mL') + ' ' + EQ + ' ' + frac(gPerL + ' g', '1 L'),
    'x grams over ' + volumeMl + ' milliliters equals ' + gPerL + ' grams over 1 liter'
  );
  html += '</li>';

  html += '<li>';
  html += '<p class="step-text">Convert 1 L on the right side to <strong>1000 mL</strong> so both denominators use the same units:</p>';
  html += eqLine(
    frac('x g', volumeMl + ' mL') + ' ' + EQ + ' ' + frac(gPerL + ' g', '1000 mL'),
    'x grams over ' + volumeMl + ' milliliters equals ' + gPerL + ' grams over 1000 milliliters'
  );
  html += '</li>';

  html += '<li>';
  html += '<p class="step-text">Cross-multiply the proportion:</p>';
  html += eqLine(
    '(x g)(1000 mL) ' + EQ + ' (' + volumeMl + ' mL)(' + gPerL + ' g)',
    'x grams times 1000 milliliters equals ' + volumeMl + ' milliliters times ' + gPerL + ' grams'
  );
  html += '</li>';

  html += '<li>';
  html += '<p class="step-text">Divide both sides by 1000 mL (the mL units cancel) and solve for x:</p>';
  html += eqLine(
    'x ' + EQ + ' ' + frac('(' + volumeMl + ')(' + gPerL + ')', '1000'),
    'x equals ' + volumeMl + ' times ' + gPerL + ' divided by 1000'
  );
  html += eqLine(
    'x ' + EQ + ' ' + frac(fmtInt(product), '1000'),
    'x equals ' + product + ' divided by 1000'
  );
  if (needsRounding) {
    html += eqLine(
      'x ' + EQ + ' ' + rawAnswerStr,
      'x equals ' + rawAnswerStr
    );
    html += eqLine(
      'x ' + APPROX + ' <strong>' + finalAnswer + ' g</strong>',
      'x is approximately ' + finalAnswer + ' grams, rounded to two decimal places',
      true
    );
  } else {
    html += eqLine(
      'x ' + EQ + ' <strong>' + finalAnswer + ' g</strong>',
      'x equals ' + finalAnswer + ' grams',
      true
    );
  }
  html += '</li>';
  html += '</ol>';

  html += '<p class="answer-line">Final answer: <strong>' + finalAnswer + ' g</strong> of ' + media.name + '</p>';

  const sc = getShortcut(volumeMl, gPerL);
  if (sc) {
    html += '<h4>' + sc.title + '</h4>';
    html += '<p>' + sc.description + '</p>';
    html += eqLine(sc.html, sc.aria, true);
  }

  return html;
}
