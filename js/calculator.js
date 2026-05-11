/** Four-function calculator with display formatting and keyboard support. */

export class Calculator {
  constructor(displayEl) {
    this.display = displayEl;
    this.reset();
  }
  reset() {
    this.current = '0';
    this.previous = null;
    this.operator = null;
    this.awaitingNew = false;
    this._render();
  }
  _render() {
    let v = this.current;
    if (v.length > 14 && v !== 'Error') {
      const n = parseFloat(v);
      v = n.toPrecision(10).replace(/\.?0+$/, '');
    }
    this.display.textContent = v;
  }
  _clearIfError() {
    if (this.current === 'Error') { this.reset(); return true; }
    return false;
  }
  inputDigit(d) {
    this._clearIfError();
    if (this.awaitingNew) {
      this.current = d;
      this.awaitingNew = false;
    } else {
      if (this.current.replace('-', '').length >= 12) return;
      this.current = this.current === '0' ? d : this.current + d;
    }
    this._render();
  }
  inputDecimal() {
    this._clearIfError();
    if (this.awaitingNew) {
      this.current = '0.';
      this.awaitingNew = false;
    } else if (!this.current.includes('.')) {
      this.current = this.current + '.';
    }
    this._render();
  }
  backspace() {
    if (this._clearIfError()) return;
    if (this.awaitingNew) return;
    if (this.current.length === 1 ||
        (this.current.length === 2 && this.current.startsWith('-'))) {
      this.current = '0';
    } else {
      this.current = this.current.slice(0, -1);
    }
    this._render();
  }
  percent() {
    if (this._clearIfError()) return;
    const n = parseFloat(this.current);
    const r = Math.round((n / 100) * 1e10) / 1e10;
    this.current = String(r);
    this.awaitingNew = true;
    this._render();
  }
  setOperator(op) {
    if (this.current === 'Error') return;
    if (this.operator !== null && !this.awaitingNew) {
      this.evaluate();
    }
    this.previous = parseFloat(this.current);
    this.operator = op;
    this.awaitingNew = true;
  }
  evaluate() {
    if (this.current === 'Error') return;
    if (this.operator === null || this.previous === null) return;
    const curr = parseFloat(this.current);
    let result;
    switch (this.operator) {
      case '+': result = this.previous + curr; break;
      case '-': result = this.previous - curr; break;
      case '*': result = this.previous * curr; break;
      case '/':
        if (curr === 0) {
          this.current = 'Error';
          this.previous = null;
          this.operator = null;
          this.awaitingNew = true;
          this._render();
          return;
        }
        result = this.previous / curr;
        break;
    }
    result = Math.round(result * 1e10) / 1e10;
    this.current = String(result);
    this.previous = null;
    this.operator = null;
    this.awaitingNew = true;
    this._render();
  }
}

/** Wire DOM buttons and keyboard events to a Calculator instance. */
export function bindCalculator(calc, { panel, showBtn, hideBtn }) {
  document.querySelectorAll('.calc-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.num !== undefined) {
        const v = btn.dataset.num;
        if (v === '.') calc.inputDecimal();
        else calc.inputDigit(v);
      } else if (btn.dataset.op !== undefined) {
        calc.setOperator(btn.dataset.op);
      } else if (btn.dataset.action) {
        switch (btn.dataset.action) {
          case 'clear':   calc.reset();      break;
          case 'back':    calc.backspace();  break;
          case 'eq':      calc.evaluate();   break;
          case 'percent': calc.percent();    break;
        }
      }
    });
  });

  // Keyboard support — only when not typing in a form field.
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;

    if (e.key >= '0' && e.key <= '9') { calc.inputDigit(e.key); }
    else if (e.key === '.') { calc.inputDecimal(); }
    else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      e.preventDefault();
      calc.setOperator(e.key);
    }
    else if (e.key === '=' || e.key === 'Enter') {
      if (e.key === '=') e.preventDefault();
      calc.evaluate();
    }
    else if (e.key === 'Escape') { calc.reset(); }
    else if (e.key === 'Backspace') {
      e.preventDefault();
      calc.backspace();
    }
  });

  showBtn.addEventListener('click', () => {
    panel.classList.add('is-open');
    showBtn.setAttribute('aria-expanded', 'true');
    showBtn.style.display = 'none';
    const firstBtn = panel.querySelector('.calc-btn');
    if (firstBtn) firstBtn.focus();
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  hideBtn.addEventListener('click', () => {
    panel.classList.remove('is-open');
    showBtn.setAttribute('aria-expanded', 'false');
    showBtn.style.display = '';
    showBtn.focus();
  });
}
