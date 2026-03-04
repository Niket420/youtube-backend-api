import mongoose from "mongoose"
import {Video} from "../models/videos.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Likes} from "../models/likes.model.js"
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const totalVideos = await Video.countDocuments({ owner: userId })

    const totalSubscriber = await Subscription.countDocuments({channel:req.user._id})

    const videoAggregation = await Video.aggregate([
        {$match: {owner:req.user._id}},
        {$group :{
            _id:null,
            totalViews:{$sum:"$views"}
        }}
    ])

    const totalViews = videoAggregation[0]?.totalViews || 0;

    const userVideos = Video.find({owner:req.user._id}).select("_id")
    const videoIds = userVideos.map(video => video._id)

    const totalLikes = await Likes.countDocuments({
        video: { $in: videoIds }
    })
    

    return res.status(200).json(new APIResponse(200,{totalVideos,totalSubscriber,totalViews,totalLikes},"Channel Status given successfully"))
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