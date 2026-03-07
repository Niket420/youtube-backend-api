import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const { Schema } = mongoose

const userSchema = new Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 20,
        index: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String
    },

    coverImage: {
        type: String
    },

    refreshToken: {
        type: String
    }
},
{
    timestamps: true
}
)


// HASH PASSWORD BEFORE SAVING
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)

    next()
})


// CHECK PASSWORD
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}


// ACCESS TOKEN
userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


// REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


// TEMP TOKEN
userSchema.methods.generateTemporaryToken = function () {

    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex")

    const tokenExpiry = Date.now() + (20 * 60 * 1000)

    return { unHashedToken, hashedToken, tokenExpiry }
}

export const User = mongoose.model("User", userSchema)