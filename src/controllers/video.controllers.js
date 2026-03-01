import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/videos.models.js"
import {User} from "../models/users.models.js"
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
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

    const { title, description } = req.body

    const videoFile = req.files?.video?.[0]
    const thumbnailFile = req.files?.thumbnail?.[0]

    if (!title || !description) {
        throw new APIError(400, "Please fill all details")
    }

    if (!videoFile) {
        throw new APIError(400, "Video not selected")
    }

    // Upload video
    const uploadVideo = await uploadOnCloudinary(videoFile.path)

    if (!uploadVideo) {
        throw new APIError(500, "Video upload failed")
    }

    let thumbnailUrl

    if (thumbnailFile) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile.path)
        thumbnailUrl = uploadedThumbnail.secure_url
    } else {
        thumbnailUrl = cloudinary.url(uploadVideo.public_id, {
            resource_type: "video",
            format: "jpg",
            transformation: [{ start_offset: "2" }]
        })
    }

    const video = await Video.create({
        videofile: uploadVideo.secure_url,
        thumbnail: thumbnailUrl,
        title,
        description,
        duration: uploadVideo.duration,
        views: 0,
        isPublished: true,
        owner: req.user._id
    })

    return res.status(201).json(
        new APIResponse(201, video, "Successfully uploaded")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const searchedVideo = await Video.findById(videoId)
    if(!searchedVideo){
        throw new APIError(404,"Video Not Found")
    }

    return res.status(200)
                .json(new APIResponse(200,searchedVideo,"Video Found"))
    
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
