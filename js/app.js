import { ANSWER_TOLERANCE_G, ATTEMPTS_PER_QUESTION } from './config.js';
import { $, formatVolume, fmt2 } from './utils.js';
import { generateQuestion, questionPoolSize } from './question.js';
import { buildSolutionHTML } from './solution.js';
import { Calculator, bindCalculator } from './calculator.js';

const state = {
  question: null,
  attemptsRemaining: ATTEMPTS_PER_QUESTION,
  questionAnswered: false
};

const els = {
  problem:        $('problem-text'),
  questionId:     $('question-id'),
  form:           $('answer-form'),
  input:          $('answer-input'),
  inputShell:     $('input-shell'),
  submitBtn:      $('submit-btn'),
  pipRow:         $('pip-row'),
  feedback:       $('feedback'),
  solution:       $('solution'),
  solutionContent:$('solution-content'),
  newQuestionBtn: $('new-question-btn'),
  footerStats:    $('footer-stats')
};

function renderProblem() {
  const { media, volumeMl, id } = state.question;
  const volStr = formatVolume(volumeMl);
  const Med = media.name.charAt(0).toUpperCase() + media.name.slice(1);
  els.problem.innerHTML =
    '<span class="med">' + Med + '</span> is prepared at ' +
    '<span class="vol">' + media.gPerL + ' g per 1 L</span> of solution. ' +
    'A lab tech needs to make <span class="vol">' + volStr + '</span>. ' +
    'How many grams of dehydrated media should they weigh out?';
  els.questionId.textContent = '#' + id;
}

function renderPips() {
  const remaining = state.attemptsRemaining;
  els.pipRow.innerHTML = '';
  for (let i = 0; i < ATTEMPTS_PER_QUESTION; i++) {
    const pip = document.createElement('span');
    pip.className = 'pip' + (i >= remaining ? ' spent' : '');
    els.pipRow.appendChild(pip);
  }
  const word = remaining === 1 ? '1 attempt' : remaining + ' attempts';
  els.pipRow.setAttribute('aria-label', word + ' remaining');
}

function setFeedback(message, type) {
  els.feedback.className = 'feedback' + (type ? ' ' + type : '');
  if (!message) {
    els.feedback.textContent = '';
    return;
  }
  const icon = { success: '✓', error: '✕', warning: '!' }[type] || '';
  els.feedback.innerHTML =
    '<span class="feedback-icon" aria-hidden="true">' + icon + '</span>' +
    '<span>' + message + '</span>';
}

function endQuestion() {
  state.questionAnswered = true;
  els.input.disabled = true;
  els.submitBtn.disabled = true;
  els.solutionContent.innerHTML = buildSolutionHTML(state.question);
  els.solution.hidden = false;
}

function loadNewQuestion(opts) {
  opts = opts || {};
  state.question = generateQuestion();
  state.attemptsRemaining = ATTEMPTS_PER_QUESTION;
  state.questionAnswered = false;
  renderProblem();
  renderPips();
  setFeedback('', null);
  els.solution.hidden = true;
  els.solutionContent.innerHTML = '';
  els.input.value = '';
  els.input.disabled = false;
  els.submitBtn.disabled = false;
  els.inputShell.classList.remove('error');
  if (opts.focus) els.input.focus();
}

function renderFooterStats() {
  if (!els.footerStats) return;
  const { total, volumeCount, mediaCount } = questionPoolSize();
  const mediaWord = mediaCount === 1 ? 'medium' : 'media types';
  els.footerStats.textContent =
    'Each refresh draws from a pool of ' + total.toLocaleString() + ' unique problems — ' +
    volumeCount.toLocaleString() + ' possible volumes (100 mL through 2 L, in 5 mL increments) across ' +
    mediaCount + ' ' + mediaWord + '.';
}

els.form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (state.questionAnswered) return;

  const raw = els.input.value.trim();
  if (raw === '') {
    setFeedback('Please enter a number before checking.', 'warning');
    els.inputShell.classList.add('error');
    els.input.focus();
    return;
  }

  const value = parseFloat(raw);
  if (isNaN(value) || !isFinite(value)) {
    setFeedback('That doesn’t look like a valid number.', 'warning');
    els.inputShell.classList.add('error');
    els.input.focus();
    return;
  }

  els.inputShell.classList.remove('error');

  const diff = Math.abs(value - state.question.answer);
  const isCorrect = diff <= ANSWER_TOLERANCE_G + 1e-9;

  if (isCorrect) {
    setFeedback('Correct! Nicely done.', 'success');
    endQuestion();
    return;
  }

  state.attemptsRemaining--;
  renderPips();

  if (state.attemptsRemaining <= 0) {
    setFeedback('Out of attempts. The correct answer is ' + fmt2(state.question.answer) +
                ' g. The full solution is below.', 'error');
    endQuestion();
  } else {
    const word = state.attemptsRemaining === 1 ? '1 attempt' : state.attemptsRemaining + ' attempts';
    setFeedback('Not quite. ' + word + ' remaining — try again.', 'error');
    els.input.select();
  }
});

els.newQuestionBtn.addEventListener('click', () => loadNewQuestion({ focus: true }));

const calc = new Calculator($('calc-display'));
bindCalculator(calc, {
  panel:   $('calc-panel'),
  showBtn: $('show-calc-btn'),
  hideBtn: $('hide-calc-btn')
});

renderFooterStats();
// First load: do NOT autofocus (lets screen-reader users hear page first).
loadNewQuestion({ focus: false });
