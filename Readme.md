# YouTube Backend API (Learning Project)

Backend project scaffold for building a YouTube-style API using Node.js, Express, and MongoDB.

## Current Status

- Core folder structure is ready.
- Initial models are created.
- Utility layer (`APIError`, `APIResponse`, `asynchandler`) is added.
- Base scripts are available for development and local runs.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Dotenv
- Nodemon
- Prettier

## Project Structure

```bash
c.you_tube_proj/
├── package.json
├── Readme.md
├── public/
└── src/
   ├── app.js
   ├── index.js
   ├── controllers/
   │   └── healthCheck.controllers.js
   ├── db/
   │   └── index.js
   ├── middlewares/
   ├── models/
   │   ├── comments.model.js
   │   ├── likes.model.js
   │   ├── playlist.model.js
   │   ├── subsription.model.js
   │   ├── tweet.model.js
   │   ├── users.model.js
   │   └── videos.model.js
   ├── routes/
   └── utils/
      ├── APIError.js
      ├── APIResponse.js
      └── asynchandler.js
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root and add your configuration (example):

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
```

## Available Scripts

```bash
npm run dev    # Starts server with nodemon
npm run code   # Starts server with node
```

## Dependencies

### Runtime
- `express` `^5.2.1`
- `mongoose` `^9.2.1`
- `dotenv` `^17.3.1`
- `bcrypt` `^6.0.0`
- `cors` `^2.8.6`

### Development
- `nodemon` `^3.1.14`
- `prettier` `3.8.1`

## Common Git Push Issues

If `git push` fails, check these in order:

1. **No upstream branch set**
  ```bash
  git push -u origin <your-branch>
  ```

2. **Remote not configured**
  ```bash
  git remote -v
  git remote add origin <repo-url>
  ```

3. **Rejected (non-fast-forward)**
  ```bash
  git pull --rebase origin <your-branch>
  git push
  ```

4. **Authentication/permission errors**
  - Recheck GitHub login/credential helper.
  - Ensure you have push access to the repository.
  - If using HTTPS, use a Personal Access Token instead of a password.

## Next Steps

1. Finalize database connection flow in `src/db/index.js`.
2. Add route registration in `src/app.js`.
3. Expand controllers and middleware.
4. Add request validation and centralized error handling.

## Author

- Niket Anand
