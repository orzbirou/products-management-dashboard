# Client Application

Angular application for Product Management Dashboard.

## Development Server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project for local testing. The build artifacts will be stored in the `dist/` directory.

## Deploy to GitHub Pages

Run `npm run deploy` to build and deploy the application to GitHub Pages. This command:
1. Builds the app with the correct base href for GitHub Pages
2. Automatically deploys to the `gh-pages` branch

**Note:** The production build uses `--base-href=/product-management-dashboard/` to work correctly on GitHub Pages, while local development uses `/` as the base href.

## Running Tests

Run `npm test` to execute the unit tests via Karma.
