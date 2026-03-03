import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if(!name || !description){
        throw new APIError(400,"Name or Description is missing")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id
    })

    return res.status(201)
                .json(new APIResponse(201,playlist,"Playlist created successfully"))

})


const getUserPlaylists = asyncHandler(async (req, res) => {

    const { userId } = req.params

    if (!userId) {
        throw new APIError(400, "UserId is missing")
    }

    const playlists = await Playlist.find({ owner: userId })

    return res.status(200).json(
        new APIResponse(200, playlists, "Playlists fetched successfully")
    )
})


const getPlaylistById = asyncHandler(async (req, res) => {

    const { playlistId } = req.params

    if (!playlistId) {
        throw new APIError(400, "Playlist ID is missing")
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("videos")
        .populate("owner", "username avatar")

    if (!playlist) {
        throw new APIError(404, "Playlist not found")
    }

    return res.status(200).json(
        new APIResponse(200, playlist, "Playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params

    if (!playlistId) {
        throw new APIError(400, "Playlist ID is missing")
    }

    if (!videoId) {
        throw new APIError(400, "Video ID is missing")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new APIError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new APIError(403, "Not authorized")
    }

    if (playlist.videos.includes(videoId)) {
        return res.status(200).json(
            new APIResponse(200, playlist, "Video already in playlist")
        )
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res.status(200).json(
        new APIResponse(200, playlist, "Video added successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

    const { playlistId, videoId } = req.params

    if (!playlistId) {
        throw new APIError(400, "Playlist ID is missing")
    }

    if (!videoId) {
        throw new APIError(400, "Video ID is missing")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new APIError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new APIError(403, "Not authorized")
    }

    if (!playlist.videos.includes(videoId)) {
        throw new APIError(404, "Video not found in playlist")
    }

    playlist.videos.pull(videoId)   // Mongoose method
    await playlist.save()

    return res.status(200).json(
        new APIResponse(200, playlist, "Video removed successfully")
    )
})



const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!playlistId) {
        throw new APIError(400, "Playlist ID is missing")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new APIError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new APIError(403, "Not authorized")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json(
        new APIResponse(200, playlist, "Playlist deleted successfully")
    )
    


})

const updatePlaylist = asyncHandler(async (req, res) => {

    const { playlistId } = req.params
    const { name, description } = req.body

    if (!playlistId) {
        throw new APIError(400, "Playlist ID is missing")
    }

    if (!name || !description) {
        throw new APIError(400, "Name or Description is missing")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new APIError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new APIError(403, "Not authorized")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $set: { name, description } },
        { new: true }
    )

    return res.status(200).json(
        new APIResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
