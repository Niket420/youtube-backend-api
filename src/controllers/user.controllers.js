import {asyncHandler} from "../utils/asynchandler.js"
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {User} from "../models/users.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"


const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,fullname,password} = req.body;

    const existedUser = User.findOne({ $or : [{username},{email}]})

    if(existedUser) {throw new APIError(409,"User already exists",[]);}

    const avatarPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage?.[0]?.path;

    if(!avatarPath){ throw new APIError(400,"Please upload avatarURL")}
    if(!coverImagePath) {throw new APIError(400,"Please upload coverImagePath")}

    const avatar = await uploadCloudinary(avatarPath)
    const coverImg = await uploadCloudinary(coverImagePath)

    if(!avatar || !coverImg) {throw new APIError(400,"Please upload the required Images")}

    const user = User.create({
        username,
        email,
        fullname,
        password,
        avatar: avatar.url,
        coverImage: coverImg.url
    })

    const checkRegisteredOrNot = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!checkRegisteredOrNot){
        throw new APIError(500,"Error in registering error")
    }

    return res.status(201).json(
            new APIResponse(201,checkRegisteredOrNot,"User registered successfully")
    )

})

const generateAccessAndRefreshToken = asyncHandler(async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }
    catch(error){
        throw new APIError(500, "Something went wrong while generating referesh and access token")
    }
})