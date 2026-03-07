import {asyncHandler} from "../utils/asynchandler.js"
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {User} from "../models/users.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from 'jsonwebtoken'


const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,fullname,password} = req.body;

    const existedUser = User.findOne({ $or : [{username},{email}]})

    if(existedUser) {throw new APIError(409,"User already exists",[]);}

    const avatarPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage?.[0]?.path;

    if(!avatarPath){ throw new APIError(400,"Please upload avatarURL")}
    if(!coverImagePath) {throw new APIError(400,"Please upload coverImagePath")}

    const avatar = await uploadOnCloudinary(avatarPath)
    const coverImg = await uploadOnCloudinary(coverImagePath)

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

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        throw new APIError(400,"Username and Password both are required")
    }

    const user = await User.findOne({email})
    if(!user){throw new APIError(400,"No user found")}

    const isPasswordValid = await User.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new APIError(401,"Invalid Credentials")
    }

    const {accessToken , refreshToken} = User.generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refershToken -avatar -coverImage")

    const options = {
        httpOnly:true,
        secure:true,
    };

    return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(
                new APIResponse(
                    200,
                    {
                        user: loggedInUser,
                    },"User logged in Successfully"
                )
            )

});

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken: "",
        },
    },
    {
        new:true,
        },
    );

    const options = {
        httpOnly:true,
        secure:true,
    };

    return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new APIResponse(200,{},"User logged out"));
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new APIError(401,"Unauthorize access")
    }
    try{
        const decodedToken = jwt.verify(
            incomingRefreshToken, process.env.JWT_REFRESH_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new APIError(401,"Invalid Refresh Token")
        }

        if(incomingRefreshToken != user.refreshToken){
            throw new APIError(401,"Refresh Token is expired")
        }

        const options = {
            httpOnly :true,
            secure:true
        };

        const {newAccessToken, newRefreshToken} = await  generateAccessAndRefreshToken(user._id)
        user.refreshToken = newRefreshToken;

        await user.save()

        return res
            .status(200)
            .cookie("accessToken",newAccessToken,options)
            .cookie("refreshToken",newRefreshToken,options)
            .json(
                new APIResponse(
                    200,
                    {newAccessToken},
                    "Access token Refreshed"
                )
            )

    }

    catch(error){
        throw new APIError(401,"Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    
    const isPasswordValid = await User.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new APIError(400,"Invalid old password")
    }

    user.password = newPassword
    await user.save()

    return res
        .status(200)
        .json(new APIResponse(200,{},"Password Changed Successfully"))

})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
            .status(200)
            .json(new APIResponse(200, req.user, "User fetch Successfully"))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname, email} = req.body()

    if(!fullname  || !email){
        throw new APIError(400,"All Fields ar required")
    }

    const user = User.findByIdAndUpdate(req.user?._id,{
        $set:{
            fullname,
            email: email
        }
    },
    {new:true}
).select("-password")

return res
        .status(201)
        .json(new APIResponse(201,user,"user get updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const AvatarImgLocalPath = req.file?.path;

    if (!AvatarImgLocalPath) {
        throw new APIError(400, "Invalid local path");
    }

    const user = await User.findById(req.user._id);

    if (user.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    const newAvatar = await uploadOnCloudinary(AvatarImgLocalPath);

    if (!newAvatar) {
        throw new APIError(400, "Image Upload Failed");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: {
                    url: newAvatar.secure_url,
                    public_id: newAvatar.public_id
                }
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new APIResponse(200, updatedUser, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const CoverImgLocalPath = req.file?.path;

    if (!CoverImgLocalPath) {
        throw new APIError(400, "Invalid local path");
    }

    const user = await User.findById(req.user._id);

    if (user.coverImage?.public_id) {
        await cloudinary.v2.uploader.destroy(user.coverImage.public_id);
    }

    const newCover = await uploadOnCloudinary(CoverImgLocalPath);

    if (!newCover) {
        throw new APIError(400, "Image Upload Failed");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: {
                    url: newAvatar.secure_url,
                    public_id: newAvatar.public_id
                }
            }
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new APIResponse(200, updatedUser, "Avatar updated successfully"));
});

const getUserChannelProfile = {}

const getWatchHistory = {}

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}