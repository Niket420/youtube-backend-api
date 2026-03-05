import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"


const createTweet = asyncHandler(async (req, res) => {

    const { content } = req.body

    if (!content) {
        throw new APIError(400, "Tweet content is required")
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res.status(201).json(
        new APIResponse(201, tweet, "Tweet created successfully")
    )
})



const getUserTweets = asyncHandler(async (req, res) => {

    
    const userId = req.params.userId || req.user._id
 
    const tweets = await Tweet.find({ owner: userId })
        .sort({ createdAt: -1 })

    if (!tweets.length) {
        throw new APIError(404, "No tweets available")
    }

    return res.status(200).json(
        new APIResponse(200, tweets, "Delivered all tweets")
    )
})


const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params
    const { content } = req.body

    if (!content) {
        throw new APIError(400, "Content is missing")
    }

    if (!tweetId) {
        throw new APIError(400, "Tweet ID is required")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new APIError(404, "Tweet not found")
    }

    if (!tweet.owner.equals(req.user._id)) {
        throw new APIError(403, "Not authorized to update this tweet")
    }

    tweet.content = content

    await tweet.save()

    return res.status(200).json(
        new APIResponse(200, tweet, "Successfully updated")
    )
})



const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params

    if (!tweetId) {
        throw new APIError(400, "Tweet ID is missing")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new APIError(404, "Tweet not found")
    }

    if (!tweet.owner.equals(req.user._id)) {
        throw new APIError(403, "Unauthorized access")
    }

    await tweet.deleteOne()

    return res.status(200).json(
        new APIResponse(200, {}, "Successfully deleted")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
