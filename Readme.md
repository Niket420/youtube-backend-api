# YouTube Platform Backend API

A production-ready backend API for a video platform built with Node.js, Express, and MongoDB.
This system provides complete functionality for video publishing, user authentication, playlists, subscriptions, comments, likes, and channel analytics.

The API follows a RESTful architecture, includes JWT authentication, file uploads with Multer, Cloudinary media storage, and secure middleware-based authorization.

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

---

If you’d like, I can also help you create a much stronger GitHub README (one that looks like a production open-source project) with:
- badges
- architecture diagram
- API table
- setup instructions
- screenshots
- deployment guide

That version looks much more impressive to recruiters.