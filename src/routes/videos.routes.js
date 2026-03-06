import {getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from "../controllers/video.controllers.js"
import {Router} from "express"
import verifyJWT from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js"

const router = Router()


router.route("/").get(getAllVideos)
                 .post(
                    upload.fields([{ name: 'videofile', maxCount: 1 },{name:'thumbnail', maxCount: 1}]),
                    publishAVideo
                 )

router.route("/:videoId").get(getVideoById)
                         .patch(upload.single('thumbnailFile'),updateVideo)
                         .delete(deleteVideo)


router.route("/toggle/publish/:videoId").patch(togglePublishStatus)

export default router
