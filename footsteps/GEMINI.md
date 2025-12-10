# Context

The core of this project is a game engine called `footsteps`. It's a vite/react/ts application, found inside the `footsteps/` directory.

* `npm run dev` - runs the app as a dev server
* `npm run build` - builds the app as a static client
* `npm run test` - launches the tests
* `npm run build:gh-pages` - builds for GitHub pages

Output from builds goes to the `dist/` directory.

The app is served through GitHub Pages, and there's a GitHub Actions workflow to deploy to GitHub Pages in `.github/workflows/deploy-pages.yaml`
