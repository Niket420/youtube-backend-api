import {toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscriber.controllers.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"
import {Router} from 'express'
import {upload} from "../middlewares/multer.middleware.js"


const router = Router()


router.use(verifyJWT)

router.route("/c/:channelId").post(toggleSubscription)
                            .get(getUserChannelSubscribers)

router.route("/u/:channelId").get(getSubscribedChannels)

export default router