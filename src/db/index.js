import mongoose from 'mongoose'

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to Database")
    }
    catch(err){
        console.log("❌ problem with connecting to Database")
        console.error(err)
         process.exit(1);
    }
}

export {connectDB};