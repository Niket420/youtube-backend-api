// import mongoose, {isValidObjectId} from "mongoose"
// import { Subscription } from "../models/subscription.model.js"
// import {APIError} from "../utils/APIError.js"
// import {APIResponse} from "../utils/APIResponse.js"
// import {asyncHandler} from "../utils/asynchandler.js"


// const toggleSubscription = asyncHandler(async (req, res) => {

//     const { channelId } = req.params
//     const subscriberId = req.user._id

//     if (!channelId) {
//         throw new APIError(400, "Channel ID not found")
//     }

//     if (channelId.toString() === subscriberId.toString()) {
//         throw new APIError(400, "Can't subscribe to own channel")
//     }

//     const existingSubscription = await Subscription.findOne({
//         subscriber: subscriberId,
//         channel: channelId
//     })

//     if (existingSubscription) {
//         await Subscription.deleteOne({ _id: existingSubscription._id })

//         return res.status(200).json(
//             new APIResponse(200, { subscribed: false }, "Unsubscribed successfully")
//         )
//     }

//     await Subscription.create({
//         subscriber: subscriberId,
//         channel: channelId
//     })

//     return res.status(200).json(
//         new APIResponse(200, { subscribed: true }, "Subscribed successfully")
//     )
// })

// // controller to return subscriber list of a channel
// const getUserChannelSubscribers = asyncHandler(async (req, res) => {

//     const { channelId } = req.params

//     if (!channelId) {
//         throw new APIError(400, "Channel ID not found")
//     }

//     const subsList = await Subscription.find({ channel: channelId })

//     return res.status(200).json(
//         new APIResponse(200, subsList, "Subscribers fetched successfully")
//     )
// })

// // controller to return channel list to which user has subscribed
// const getSubscribedChannels = asyncHandler(async (req, res) => {

//     const {subscriberId} = req.params

//     const subsList = await Subscription.find({ subscriber: subscriberId })
//         .populate("channel", "username avatar")

//     return res.status(200).json(
//         new APIResponse(200, subsList, "Subscribed channels fetched successfully")
//     )
// })

// export {
//     toggleSubscription,
//     getUserChannelSubscribers,
//     getSubscribedChannels
// }


import mongoose, { isValidObjectId } from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import { APIError } from "../utils/APIError.js"
import { APIResponse } from "../utils/APIResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"


// Toggle Subscription
const toggleSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params
    const subscriberId = req.user._id

    if (!isValidObjectId(channelId)) {
        throw new APIError(400, "Invalid Channel ID")
    }

    if (channelId.toString() === subscriberId.toString()) {
        throw new APIError(400, "Cannot subscribe to your own channel")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    if (existingSubscription) {

        await Subscription.deleteOne({ _id: existingSubscription._id })

        return res.status(200).json(
            new APIResponse(200, { subscribed: false }, "Unsubscribed successfully")
        )
    }

    await Subscription.create({
        subscriber: subscriberId,
        channel: channelId
    })

    return res.status(200).json(
        new APIResponse(200, { subscribed: true }, "Subscribed successfully")
    )
})


// Get Subscribers of a Channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new APIError(400, "Invalid Channel ID")
    }

    const subsList = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username avatar")

    return res.status(200).json(
        new APIResponse(200, subsList, "Subscribers fetched successfully")
    )
})


// Get Channels a User Subscribed To
const getSubscribedChannels = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new APIError(400, "Invalid Subscriber ID")
    }

    const subsList = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username avatar")

    return res.status(200).json(
        new APIResponse(200, subsList, "Subscribed channels fetched successfully")
    )
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}