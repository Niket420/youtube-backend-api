import mongoose from 'mongoose';
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