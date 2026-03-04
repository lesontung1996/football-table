# Quickstart: Random Team Wheel

## Prerequisites

- Node.js and npm installed.
- Project dependencies installed:

```bash
npm install
```

## Run the App

From the repository root:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Access the Random Team Wheel

- Navigate to `/random-wheel` in the running app (e.g.,
  `http://localhost:3000/random-wheel`).
- You should see:
  - One or two wheels (depending on configuration).
  - Controls to include/exclude leagues/nations and teams.
  - FPL-inspired colors with vibrant slice backgrounds.

## Basic Usage

1. Open the Random Team Wheel page.
2. Optionally adjust which leagues/nations or teams are included.
3. Choose whether to use one or two wheels.
4. Press the spin control to spin the wheel(s).
5. Read the selected team(s) from the clearly highlighted result area.

## Manual Testing Checklist

Since there are no unit, integration, or e2e tests for this feature initially, use this
manual checklist:

- [ ] First visit shows a sensible default list of popular teams and allows a spin.
- [ ] Spinning with one wheel selects a random team and clearly displays the result.
- [ ] Enabling two wheels spins both independently and shows both results.
- [ ] The "Select your favorite team" slice behaves like any other team result when hit.
- [ ] Including/excluding leagues or nations updates which teams can be selected.
- [ ] Excluding all teams prevents spinning and shows a clear message.
- [ ] Configuration changes persist when reloading the page on the same device.
- [ ] Layout and controls are usable on a narrow mobile viewport (around 320px wide).

