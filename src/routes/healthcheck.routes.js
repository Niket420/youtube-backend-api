import {healthcheck} from "../controllers/subscriber.controllers.js"
import {Router} from 'express'

const router = Router()
router.route('/').get(healthcheck)

export default healthcheck