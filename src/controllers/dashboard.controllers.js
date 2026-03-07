import mongoose from "mongoose"
import { Video } from "../models/videos.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Likes } from "../models/likes.model.js"
import { APIError } from "../utils/APIError.js"
import { APIResponse } from "../utils/APIResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"


const getChannelStats = asyncHandler(async (req, res) => {

    const userId = req.user._id

    // Total videos
    const totalVideos = await Video.countDocuments({ owner: userId })

    // Total subscribers
    const totalSubscriber = await Subscription.countDocuments({
        channel: userId
    })

    // Total views using aggregation
    const videoAggregation = await Video.aggregate([
        { $match: { owner: userId } },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const totalViews = videoAggregation[0]?.totalViews || 0

    // Get user videos
    const userVideos = await Video.find({ owner: userId }).select("_id")

    const videoIds = userVideos.map(video => video._id)

    // Total likes on all videos
    const totalLikes = await Likes.countDocuments({
        video: { $in: videoIds }
    })

    return res.status(200).json(
        new APIResponse(
            200,
            { totalVideos, totalSubscriber, totalViews, totalLikes },
            "Channel stats fetched successfully"
        )
    )
})


const getChannelVideos = asyncHandler(async (req, res) => {

    const videos = await Video.find({ owner: req.user._id })

    if (videos.length === 0) {
        throw new APIError(404, "No videos found")
    }

    return res.status(200).json(
        new APIResponse(200, videos, "Here are all videos")
    )
})


export {
    getChannelStats,
    getChannelVideos
}