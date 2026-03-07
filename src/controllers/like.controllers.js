import mongoose, { isValidObjectId } from "mongoose"
import { Likes } from "../models/likes.model.js"
import { APIError } from "../utils/APIError.js"
import { APIResponse } from "../utils/APIResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"


const toggleVideoLikes = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new APIError(400, "Invalid video ID")
    }

    const existingLike = await Likes.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if (!existingLike) {

        await Likes.create({
            video: videoId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new APIResponse(200, {}, "Video liked")
        )
    } 
    else {

        await Likes.deleteOne({
            video: videoId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new APIResponse(200, {}, "Video unliked")
        )
    }
})


const toggleCommentLikes = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new APIError(400, "Invalid comment ID")
    }

    const existingLike = await Likes.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if (!existingLike) {

        await Likes.create({
            comment: commentId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new APIResponse(200, {}, "Comment liked")
        )
    } 
    else {

        await Likes.deleteOne({
            comment: commentId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new APIResponse(200, {}, "Comment unliked")
        )
    }
})


const toggleTweetLikes = asyncHandler(async (req, res) => {

    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new APIError(400, "Invalid tweet ID")
    }

    const existingLike = await Likes.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (!existingLike) {

        await Likes.create({
            tweet: tweetId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new APIResponse(200, {}, "Tweet liked")
        )
    } 
    else {

        await Likes.deleteOne({
            tweet: tweetId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new APIResponse(200, {}, "Tweet unliked")
        )
    }
})


const getLikedVideos = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const likedVideos = await Likes.find({
        likedBy: userId,
        video: { $exists: true }
    })
        .populate({
            path: "video",
            select: "title thumbnail views owner createdAt"
        })
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new APIResponse(
            200,
            likedVideos,
            "Liked videos fetched successfully"
        )
    )
})


export {
    toggleCommentLikes,
    toggleTweetLikes,
    toggleVideoLikes,
    getLikedVideos
}