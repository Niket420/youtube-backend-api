import {createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
    } from "../controllers/subscriber.controllers.js"

import verifyJWT from "../middlewares/auth.middleware.js"
import {Router} from 'express'
import upload from "../middlewares/multer.middleware.js"


const router = Router()
router.use(verifyJWT)

router.route("/").post(createPlaylist)

router.route("/:playlistId").get(getPlaylistById)
                            .patch(updatePlaylist)
                            .delete(deletePlaylist)

router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist)
                                          .delete(removeVideoFromPlaylist)

router.route("/user/:userId").get(getUserPlaylists)

export default router
