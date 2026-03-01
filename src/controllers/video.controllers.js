import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    const getVideos = async ({
        page,
        limit,
        query,
        sortBy,
        sortType,
        userId
    }) => {

        page = parseInt(page)
        limit = parseInt(limit)

        const skip = (page - 1) * limit

        let filter = {}

        if (query) {
            filter.title = { $regex: query, $options: "i" }
        }

        if (userId) {
            filter.owner = userId
        }

        let sortOptions = {}

        if (sortBy) {
            sortOptions[sortBy] = sortType === "asc" ? 1 : -1
        } else {
            sortOptions.createdAt = -1
        }

        const videos = await Video.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)

        const total = await Video.countDocuments(filter)

        return {
            total,
            totalPages: Math.ceil(total / limit),
            page,
            videos
        }
    }

    // 🔥 Call it properly inside controller
    const result = await getVideos({
        page,
        limit,
        query,
        sortBy,
        sortType,
        userId
    })

    // 🔥 Send response
    res.status(200).json(result)
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
