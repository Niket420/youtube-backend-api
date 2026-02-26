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

const login = asyncHandler(async(req,res)=>{
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

const logout = asyncHandler(async(req,res)=>{
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

const refreshAccessToken={}

const changeCurrentPassword={}

const getCurrentUser = {}

const updateAccountDetails={}

const updateUserAvatar = {}

const updateUserCoverImage = {}

const getUserChannelProfile = {}

const getWatchHistory = {}