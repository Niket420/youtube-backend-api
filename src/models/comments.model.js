import mongoose from 'mongoose'

const Schema = mongoose

const commentsSchema = new Schema({
    content : {
        type:string,
    },

    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},
{timestamps:true})



commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentsSchema)