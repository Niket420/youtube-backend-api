import {APIResponse} from '../utils/APIResponse.js'
import {asyncHandler} from "../utils/asynchandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new APIResponse(200, "Server is running"));
});


export {healthcheck};

