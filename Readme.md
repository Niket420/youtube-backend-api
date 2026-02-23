# YouTube Backend API (Learning Project)

Backend project scaffold for building a YouTube-style API using Node.js and Express.

## Current Status

Project setup is initialized, dependencies are installed, and base folder structure is ready.

## Work Done Till Now

Based on your current workspace state and terminal context, the following has been completed:

- Initialized Node project (`package.json` present).
- Installed `express` as a dependency.
- Installed `prettier` as a dev dependency.
- Created entry files: `index.js`, `app.js`.
- Created module folders inside `src/`:
	- `controllers/`
	- `middlewares/`
	- `models/`
	- `routes/`
	- `utils/`
- Added formatting config files: `.prettierrc`, `.prettierignore`.
- Latest command in this project terminal context: `touch index.js`.

## Project Structure

```bash
c.you_tube_proj/
├── app.js
├── index.js
├── package.json
├── package-lock.json
├── .env
├── .prettierrc
├── .prettierignore
├── Readme.md
└── src/
		├── controllers/
		├── middlewares/
		├── models/
		├── routes/
		└── utils/
```

## Installed Packages

- Runtime:
	- `express`
- Development:
	- `prettier`

## Available NPM Scripts

Current scripts in `package.json`:

- `npm test` → placeholder test script (not configured yet)

## Next Recommended Steps

1. Set up server bootstrap in `index.js`.
2. Configure Express app in `app.js`.
3. Add route files in `src/routes/` and connect them in `app.js`.
4. Add controllers and middleware incrementally.
5. Add a `dev` script (with `nodemon`) for faster development.

## Author

- Niket Anand
