import mongoose from 'mongoose';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from 'crypto'



const { Schema } = mongoose;

const userSchema =  new Schema({
    username:{
        type:String,
        required:String,
        unique:true,
        trim:true,
        minLength:4,
        maxLength:20,
        index:true

    },

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true, 
    },
    password:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    refershToken:{
        type:String
    }

    

},
{
    timestamps:true
    }
)


userSchema.pre('save',async function(next){
    if(!this.isModified()) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function checkUser(password){
        return await bcrypt.compare(password, this.password);
}   

userSchema.methods.generateAccessToken = jwt.sign(
        {_id:this._id,
            email: this.email,
            username:this.username
        },
        process.env.JWT_ACCESS_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)


userSchema.methods.generateRefreshToken = jwt.sign(
        {_id:this._id,
            email: this.email,
            username:this.username
        },
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)

userSchema.methods.generateTemperoryToken = function(){
        const unHashedToken =  crypto.randomBytes(20).toString("hex") 
        
        const HashedToken =  crypto.createHash('sha256')
                                    .update(unHashedToken)
                                    .digest("hex")

        const tokenExpiry = Date.now() + (20*60 + 1000)

        return {unHashedToken, HashedToken, tokenExpiry}

}



export const User = mongoose.model('User', userSchema);
