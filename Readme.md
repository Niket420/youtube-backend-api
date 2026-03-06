# YouTube Platform Backend API

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5)

A production-ready backend API for a video platform built with Node.js, Express, and MongoDB.
This system provides complete functionality for video publishing, user authentication, playlists, subscriptions, comments, likes, and channel analytics.

The API follows a RESTful architecture, includes JWT authentication, file uploads with Multer, Cloudinary media storage, and secure middleware-based authorization.

---

## Quick Start

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd c.you_tube_proj
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root and add your values:

```env
PORT=8000
MONGODB_URI=<your-mongodb-uri>
CORS_ORIGIN=<your-frontend-origin>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

### 3) Start the server

```bash
npm run dev
```

---

## API Overview

| Module | Method | Endpoint | Description |
|---|---|---|---|
| Health | GET | `/api/v1/healthcheck` | Check API health/status |
| Users | POST | `/api/v1/users/register` | Register a new user |
| Users | POST | `/api/v1/users/login` | Login user |
| Users | GET | `/api/v1/users/current-user` | Get logged-in user profile |
| Videos | GET | `/api/v1/videos` | Get all videos with filters |
| Videos | POST | `/api/v1/videos` | Publish/upload a video |
| Videos | PATCH | `/api/v1/videos/:videoId` | Update video details/thumbnail |
| Videos | DELETE | `/api/v1/videos/:videoId` | Delete a video |
| Playlist | POST | `/api/v1/playlist` | Create a playlist |
| Comments | POST | `/api/v1/comments/:videoId` | Add comment to a video |
| Likes | POST | `/api/v1/likes/toggle/v/:videoId` | Toggle like on a video |
| Subscriptions | POST | `/api/v1/subscriptions/c/:channelId` | Subscribe/Unsubscribe channel |

---

## Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

### Authentication
- JWT (Access + Refresh Tokens)
- Cookie based authentication

### Media Handling
- Multer (file uploads)
- Cloudinary (video/image storage)

### Security & Middleware
- CORS
- Cookie Parser
- Custom Error Handling
- JWT Authentication Middleware

---

## System Architecture

The project follows a layered backend architecture:

```text
Client
   ↓
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Models
   ↓
MongoDB
```

### Key Components

#### Routes
- Define API endpoints
- Apply middleware

#### Controllers
- Contain business logic

#### Models
- MongoDB schema definitions using Mongoose

#### Middlewares
- Authentication
- File upload
- Error handling

---

## Core Features

### 1. Authentication System

Secure user authentication using JWT tokens stored in cookies.

Features include:
- User registration
- User login
- Logout
- Access token refresh
- Change password
- Update account details
- Avatar and cover image upload

Security features:
- Password hashing
- JWT verification middleware
- Cookie-based authentication

---

### 2. Video Management

Users can upload and manage videos.

Features:
- Upload videos with thumbnails
- Auto-generate thumbnails if not provided
- Update video metadata
- Delete videos
- Toggle publish status
- Pagination and search support
- Sort videos by views, date, etc.

Video files are stored in Cloudinary, while metadata is stored in MongoDB.

---

### 3. Playlist System

Users can organize videos into playlists.

Features:
- Create playlist
- Update playlist details
- Delete playlist
- Add video to playlist
- Remove video from playlist
- View playlists created by a user

Each playlist stores references to videos using MongoDB ObjectIds.

---

### 4. Comments System

Users can interact with videos through comments.

Features:
- Add comment
- Edit comment
- Delete comment
- Fetch comments for a video
- Pagination support

---

### 5. Like System

Users can like different types of content.

Supported likes:
- Video likes
- Comment likes
- Tweet likes

Features:
- Toggle like/unlike
- Fetch videos liked by a user

The system uses a single likes collection that references different entities.

---

### 6. Subscription System

Users can subscribe to channels.

Features:
- Subscribe / Unsubscribe
- View channel subscribers
- View channels a user subscribed to

This is implemented using a subscriber → channel relationship.

---

### 7. Channel Analytics

Creators can view statistics about their channel.

Metrics include:
- Total videos uploaded
- Total video views
- Total subscribers
- Total likes on videos

Data is computed using MongoDB aggregation pipelines.

---

## Media Upload System

The project uses Multer middleware for handling file uploads.

Supported uploads:
- Avatar
- Cover Image
- Video files
- Video thumbnails

Uploaded media is stored in Cloudinary and the URLs are saved in MongoDB.

---

## Security Features

The API implements several security best practices:
- JWT authentication
- Protected routes using middleware
- CORS configuration
- Cookie-based session management
- Input validation
- File upload restrictions
- Ownership checks for resources

---

## Example Protected Route

`GET /api/v1/users/current-user`

Request flow:

```text
Client Request
      ↓
verifyJWT middleware
      ↓
Controller
      ↓
Database query
      ↓
Response
```

---

## Project Structure

```text
src
 ├ controllers
 │    user.controller.js
 │    video.controller.js
 │    playlist.controller.js
 │    comment.controller.js
 │    like.controller.js
 │
 ├ models
 │    user.model.js
 │    video.model.js
 │    playlist.model.js
 │    comment.model.js
 │    like.model.js
 │
 ├ routes
 │    user.routes.js
 │    video.routes.js
 │    playlist.routes.js
 │
 ├ middlewares
 │    auth.middleware.js
 │    multer.middleware.js
 │
 ├ utils
 │    ApiError.js
 │    ApiResponse.js
 │    asyncHandler.js
 │
 └ app.js
```

---

## Example API Endpoint

### Upload Video

`POST /api/v1/videos`

Form data:

- videofile
- thumbnail
- title
- description

Response:

```json
{
  "statusCode": 201,
  "message": "Video uploaded successfully"
}
```

---

## Error Handling

The project uses a custom error system:

- ApiError
- ApiResponse
- asyncHandler

Benefits:
- Centralized error handling
- Clean controller logic
- Consistent API responses

---

## Key Learning Outcomes

This project demonstrates:
- REST API design
- Middleware architecture
- JWT authentication
- File upload pipelines
- Cloudinary integration
- MongoDB schema design
- Aggregation queries
- Secure backend practices

---

## Future Improvements

Potential improvements include:
- Video streaming support
- Recommendation system
- Redis caching
- WebSockets for live notifications
- Rate limiting
- Advanced search using Elasticsearch

