import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import mongoose from 'mongoose';

const { Schema } = mongoose;

const videoSchema = new Schema({
    videofile:{
        type:string,
        required:true},

    thumbnail:{
        type:string,
         required:true
    },

    title:{
        type:string,
         required:true
    },
    description:{
        type:string,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:boolean,
        default:true
    },
    
     owner:{
        type:Schema.type.ObjectId,
        ref: "User"
    },

},{
    timpestamps:true
})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("video", videoSchema);