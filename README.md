# Media Prep Math Practice

A self-contained web app that drills microbiology students on the math behind preparing dehydrated culture media. Students see a randomized problem, get three attempts to enter the correct mass in grams, and on either success or failure are shown a full step-by-step ratio-and-proportion solution.

Built for Preliminary Microbiology lab instruction. Drop it on GitHub Pages and share the link — no server, no build step, no dependencies.

---

## Live demo

Once deployed, the app lives at: `https://calebhendren.github.io/mediacalc/`

---

## Features

- **Randomized problems on every page load.** 1,905 unique combinations: 381 volumes (100 mL through 2 L in 5 mL increments) × 5 media types.
- **75/25 volume mix.** 75% of the time the prompt uses a "clean" classroom volume (100, 150, 200, 250, 300, 400, 500, 600, 750 mL, 1 L, 1.5 L, 2 L); 25% of the time it uses a truly random value snapped to the nearest 5 mL.
- **Three attempts per problem**, with a visual pip indicator showing remaining attempts.
- **Worked solution.** Reveals after a correct answer or three wrong attempts, walking through the proportion `x g / V mL = gPerL g / 1 L`, the unit conversion, the cross-multiplication, and the final 2-decimal-place answer.
- **Mental-math shortcuts** for the four common volumes where one is useful: 100 mL (move the decimal), 250 mL (÷4), 500 mL (÷2), and 2 L (×2).
- **Liter display for ≥ 1 L volumes.** Questions show "1.5 L" instead of "1500 mL"; the solution starts with an explicit L-to-mL conversion step.
- **Volumes ≥ 1000 mL are displayed in liters.** Volumes < 1000 mL are displayed in milliliters.
- **On-screen calculator.** Always visible on desktop as a sticky sidebar; collapsible on mobile via a "Show calculator" button. Supports keyboard input (digits, operators, Enter, Backspace, Escape) when the answer field is not focused.
- **New question button** for unlimited practice without reloading the page.
- **Accessibility.**
  - Semantic HTML landmarks and ARIA live regions for feedback.
  - Skip link, visible focus rings, ≥ 44 × 44 px touch targets.
  - Every equation has a `role="math"` and a plain-English `aria-label` so screen readers describe the math instead of trying to parse the visual fraction layout.
  - `prefers-reduced-motion` respected.

---

## Media reference values (g per 1 L)

| Medium                | g/L |
| --------------------- | --- |
| Nutrient agar         | 23  |
| Tryptic soy agar      | 40  |
| Citrate agar          | 24  |
| MacConkey agar        | 50  |
| Mannitol salt agar    | 111 |

These are the values the app uses to generate problems and grade answers. They reflect common Difco/BD formulations; verify against your own manufacturer's label before using in the actual lab.

---

## How a problem is graded

The student's input is parsed as a number and compared to the true answer with a tolerance of **±0.02 g**. This is loose enough to accept either round-half-up or round-half-down at the 2-decimal place, but tight enough that random guesses fail.

For example, for 1635 mL of MSA the exact answer is 181.485 g. Any of the following is accepted:

- 181.49
- 181.48
- 181.485

---

## Project structure

```
.
├── index.html      # The entire app: HTML, CSS, and JS in one file
└── README.md
```

That's it. No `package.json`, no build, no install step.

---

## Local development

Because the app is a single static file, you can open `index.html` directly in any modern browser. If you'd like to run it through a local server (recommended for testing CORS-restricted APIs or inspecting realistic network behavior), you can use any of:

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

No build step or GitHub Actions configuration required.

---

## Browser support

Tested on current versions of Chrome, Safari, Firefox, and Edge, on both desktop and mobile. The app uses no build tooling and no transpilation, so anything supporting ES6 (every browser released in the last several years) will work.

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

## Customizing the media list

To add, remove, or change media, edit the `MEDIA` constant near the top of the JavaScript section in `index.html`:

```js
const MEDIA = [
  { name: 'nutrient agar',      gPerL: 23  },
  { name: 'tryptic soy agar',   gPerL: 40  },
  { name: 'citrate agar',       gPerL: 24  },
  { name: 'MacConkey agar',     gPerL: 50  },
  { name: 'mannitol salt agar', gPerL: 111 }
];
```

If you change the number of media or the volume range, remember to update the variation count in the footer (`<footer>` element near the bottom of the file).

---

## License

MIT. Use it, modify it, share it with your students.
