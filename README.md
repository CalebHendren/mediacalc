# Media Prep Math Practice

A self-contained web app that drills microbiology students on the math behind preparing dehydrated culture media. Students see a randomized problem, get three attempts to enter the correct mass in grams, and on either success or failure are shown a full step-by-step ratio-and-proportion solution.

Built for Preliminary Microbiology lab instruction. Drop it on GitHub Pages and share the link — no server, no build step, no dependencies.

---

## Live demo

Once deployed, the app lives at: `https://calebhendren.github.io/mediacalc/`

---

## Features

- **Randomized problems on every page load.** The pool size scales with your media list: by default 1,905 unique combinations (381 volumes × 5 media types). The footer recomputes the count automatically when you edit the media list.
- **75/25 volume mix.** 75% of the time the prompt uses a "clean" classroom volume (100, 150, 200, 250, 300, 400, 500, 600, 750 mL, 1 L, 1.5 L, 2 L); 25% of the time it uses a truly random value snapped to the nearest 5 mL.
- **Three attempts per problem**, with a visual pip indicator showing remaining attempts.
- **Worked solution.** Reveals after a correct answer or three wrong attempts, walking through the proportion `x g / V mL = gPerL g / 1 L`, the unit conversion, the cross-multiplication, and the final 2-decimal-place answer.
- **Mental-math shortcuts** for the four common volumes where one is useful: 100 mL (move the decimal), 250 mL (÷4), 500 mL (÷2), and 2 L (×2).
- **Liter display for ≥ 1 L volumes.** Questions show "1.5 L" instead of "1500 mL"; the solution starts with an explicit L-to-mL conversion step.
- **On-screen calculator.** Always visible on desktop as a sticky sidebar; collapsible on mobile via a "Show calculator" button. Supports keyboard input (digits, operators, Enter, Backspace, Escape) when the answer field is not focused.
- **New question button** for unlimited practice without reloading the page.
- **Accessibility.**
  - Semantic HTML landmarks and ARIA live regions for feedback.
  - Skip link, visible focus rings, ≥ 44 × 44 px touch targets.
  - Every equation has a `role="math"` and a plain-English `aria-label` so screen readers describe the math instead of trying to parse the visual fraction layout.
  - `prefers-reduced-motion` respected.
- **Light and dark themes.** Follows the browser/OS color scheme: dark by default, and the Chattanooga State light theme (navy, royal blue, orange — shared with MicroGrade) when light is preferred.

---

## How a problem is graded

The student's input is parsed as a number and compared to the true answer with a tolerance of **±0.02 g** (configurable). This is loose enough to accept either round-half-up or round-half-down at the 2-decimal place, but tight enough that random guesses fail.

For example, for 1635 mL of MSA the exact answer is 181.485 g. Any of the following is accepted:

- 181.49
- 181.48
- 181.485

---

## Project structure

```
.
├── index.html           # Markup only — no inline CSS or JS
├── css/
│   └── styles.css       # All styles
├── js/
│   ├── config.js        # Media list and tunable constants — edit this
│   ├── utils.js         # Formatting and random helpers
│   ├── question.js      # Random question generation
│   ├── solution.js      # Worked-solution HTML builder
│   ├── calculator.js    # On-screen calculator widget
│   └── app.js           # Entry point — wires everything together
└── README.md
```

The JS is loaded as native ES modules (`<script type="module">`), which every browser shipped in the last several years supports. There is still no `package.json`, no bundler, no build step.

---

## Customizing the media list

Everything you might want to change lives in a single file: **`js/config.js`**.

### Add, remove, or edit media types

```js
export const MEDIA = [
  { name: 'nutrient agar',      gPerL: 23  },
  { name: 'tryptic soy agar',   gPerL: 40  },
  { name: 'citrate agar',       gPerL: 24  },
  { name: 'MacConkey agar',     gPerL: 50  },
  { name: 'mannitol salt agar', gPerL: 111 }
];
```

- `name` is rendered directly in the problem text. Use the spelling and capitalization you want students to see (the app capitalizes the first letter at the start of a sentence).
- `gPerL` is grams of dehydrated powder per 1 L of finished medium.
- You can have any number of entries (1 or more). The footer's "X unique problems across N media types" line updates automatically.

These default values reflect common Difco/BD formulations; verify against your own manufacturer's label before using in the actual lab.

### Other tunable constants (same file)

| Constant | Default | What it controls |
| --- | --- | --- |
| `COMMON_VOLUMES_ML` | `[100, 150, 200, 250, 300, 400, 500, 600, 750, 1000, 1500, 2000]` | The "clean" classroom volumes used 75% of the time. |
| `COMMON_VOLUME_PROBABILITY` | `0.75` | Probability (0–1) of picking from `COMMON_VOLUMES_ML` instead of the random range. |
| `RANDOM_MIN_ML` / `RANDOM_MAX_ML` / `RANDOM_STEP_ML` | `100` / `2000` / `5` | Random-volume range and step size in mL. |
| `ANSWER_TOLERANCE_G` | `0.02` | Maximum allowed error in grams when grading a student's answer. |
| `ATTEMPTS_PER_QUESTION` | `3` | Number of guesses before the solution is revealed. The pip indicator scales to match. |

No other file needs to change. The footer count, attempts pip count, and grading tolerance all derive from these values at runtime.

---

## Local development

Because the app uses ES modules, opening `index.html` directly via `file://` will be blocked by the browser's module CORS rules. Run it through a local static server instead:

```bash
# Python 3
python3 -m http.server 8000

# Node (with npx, no install needed)
npx serve .
```

Then visit `http://localhost:8000`.

---

## Deployment to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder.
4. Save. After a minute or two, the site will be live at `https://calebhendren.github.io/<repo-name>/`.

GitHub Pages serves the files over HTTPS, so the ES modules load with no extra configuration. No build step or GitHub Actions required.

---

## Browser support

Tested on current versions of Chrome, Safari, Firefox, and Edge, on both desktop and mobile. The app uses no build tooling and no transpilation; it relies on ES2017+ features and native ES modules, which every browser released since 2018 supports.

---

## Accessibility notes

This app is intended for use in higher-education courses and aims to meet **WCAG 2.1 Level AA**.

- All interactive controls are keyboard-reachable with visible focus indicators.
- Color is never the sole indicator of state; feedback messages also include text and an icon.
- Touch targets meet the 44 × 44 px minimum.
- Form fields have explicit `<label>` associations, validation messages are surfaced via an ARIA live region, and equation blocks expose plain-English descriptions for screen readers.
- A skip link allows keyboard users to jump past the header to the practice problem.

If you find an accessibility issue, please open an issue on the repository.

---

## License

MIT. Use it, modify it, share it with your students.
