import {getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    } from "../controllers/subscriber.controllers.js"

import verifyJWT from "../middlewares/auth.middleware.js"
import {Router} from 'express'
import upload from "../middlewares/multer.middleware.js"


const router = Router()
router.use(verifyJWT)

router.route("/:videoId").get(getVideoComments)
                        .post(addComment)

router.route("/c/:commentId").patch(updateComment)
                            .delete(deleteComment)


export default router