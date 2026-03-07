import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comments.model.js"
import { APIError } from "../utils/APIError.js"
import { APIResponse } from "../utils/APIResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"


const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) {
        throw new APIError(400, "Invalid Video ID")
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)

    const skip = (pageNum - 1) * limitNum

    const allComments = await Comment.find({ video: videoId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)

    return res.status(200).json(
        new APIResponse(200, allComments, "Here are all comments")
    )
})


const addComment = asyncHandler(async (req, res) => {

    const { comment } = req.body
    const { videoId } = req.params

    if (!comment) {
        throw new APIError(400, "Comment is required")
    }

    if (!isValidObjectId(videoId)) {
        throw new APIError(400, "Invalid Video ID")
    }

    const newComment = await Comment.create({
        content: comment,
        video: videoId,
        owner: req.user._id
    })

    return res.status(201).json(
        new APIResponse(201, newComment, "Comment added successfully")
    )
})


const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params
    const { newComment } = req.body

    if (!isValidObjectId(commentId)) {
        throw new APIError(400, "Invalid Comment ID")
    }

    if (!newComment) {
        throw new APIError(400, "New comment content is required")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new APIError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new APIError(403, "Not authorized to update this comment")
    }

    const updated = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content: newComment } },
        { new: true }
    )

    return res.status(200).json(
        new APIResponse(200, updated, "Comment updated successfully")
    )
})


const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new APIError(400, "Invalid Comment ID")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new APIError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new APIError(403, "Not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(
        new APIResponse(200, {}, "Comment deleted successfully")
    )
})


export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}