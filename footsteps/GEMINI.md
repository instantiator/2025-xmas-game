# Context

The core of this project is a game engine called `footsteps`. It's a vite/react/ts application, found inside the `footsteps/` directory.

## Invocations

- Run locally with: `npm run dev`
- Build static pages with: `npm run build`
- View the static preview with: `npm run preview`
- Build for GitHub Pages with: `npm run build:gh-pages`
- Run the tests once: `npm run test:run` (ideal an automatic test of new changes)
- Run the tests (and watch for changes): `npm run test` (for the user)
- Run linting with: `npm run lint`

The license file in `src/assets/license-report.json` is generated before each action.

Output from builds goes to the `dist/` directory. A simple way to serve from there is with `npx serve`.

## Run a dev server

Launch footsteps locally with `npm run dev`

All games in the local repository at `src/assets/game-repository.json` are available at their own url.

| Game        | Game URL                             | Game data URL                             |
| ----------- | ------------------------------------ | ----------------------------------------- |
| `test-game` | http://localhost:5173/game/test-game | http://localhost:5173/game/test-game/json |

## Coding practices

When generating code, use formatting and style that matches the style of existing code - and follow good practices.

- Always test that the code you have written will build
- Always run the tests with `npm run test:run` to check for regressions
- Always check eslint for errors (ignore warnings unless they're new)

Explain new errors and warnings after a build, but only fix errors. After you've explained a warning to the user, ask if it's important to fix. Remember the answer.

## Mac OS instructions

In each new session (or if you have not done this yet for the current session), check if you are running on Mac OS. If you are, then before returning control to the user (eg. with a question or a summary, or with a change you want them to review), execute `say ready` - this will draw their attention back to the terminal you are operating through.
