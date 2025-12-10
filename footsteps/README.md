# Footsteps

## Invocations

* Run locally with: `npm run dev`
* Build static pages with: `npm run build`
* View the static preview with: `npm run preview`
* Build for GitHub Pages with: `npm run build:gh-pages`
* Run the tests with: `npm run test`
* Run eslint with: `npm run lint`

The license file in `src/assets/license-report.json` is generated before each action.

Output from builds goes to the `dist/` directory. A simple way to serve from there is with `npx serve`.

## Run a dev server

Launch footsteps locally with `npm run dev`

All games in the local repository at `src/assets/game-repository.json` are available at their own url.

| Game | Game URL | Game data URL |
|-|-|-|
| `test-game` | http://localhost:5173/game/test-game | http://localhost:5173/game/test-game/json |

## GitHub Pages

The app is served through GitHub Pages, and there's a GitHub Actions workflow to deploy to GitHub Pages in `.github/workflows/deploy-pages.yaml`
