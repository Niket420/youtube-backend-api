import mongoose from 'mongoose'

const Schema = mongoose

const LikesSchema = new Schema({
    comment : {
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },

    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },

    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"Tweet"
    }
},
{timestamps:true})



LikesSchema.plugin(mongooseAggregatePaginate)

export const Likes = mongoose.model("Likes", LikesSchema)