import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";



 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
    
    });



const uploadOnCloudinary = async(localPath)=>{
    try{
         if(!localPath) return null
         const CloudinaryResponse = await cloudinary.uploader.upload(localPath,{resouce_type:"auto"})
         fs.unlinkSync(localPath)
         return CloudinaryResponse
    }
    catch(error){
        console.error("Error in uploading on cloudinary :" , error)
        fs.unlinkSync(localPath)
        return null
    }
   
}

export {uploadCloudinary}
    
