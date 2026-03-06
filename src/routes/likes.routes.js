import {toggleCommentLikes,
    toggleTweetLikes,
    toggleVideoLikes,
    getLikedVideos
    } from "../controllers/like.controllers.js"

import verifyJWT from "../middlewares/auth.middleware.js"
import {Router} from 'express'
import upload from "../middlewares/multer.middleware.js"


const router = Router()
router.use(verifyJWT)

router.route("/toggle/v/:commentId").post(toggleCommentLikes)
router.route("/toggle/c/:videoId").post(toggleVideoLikes)
router.route("/toggle/t/:tweetId").post(toggleTweetLikes)
router.route("/videos").get(getLikedVideos)