import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
})


const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null
    console.log("local path for upload ", localPath)
    const cloudinaryResponse = await cloudinary.uploader.upload(
      localPath,
      { resource_type: "auto" }
    )

    console.log("File uploaded on Cloudinary:", cloudinaryResponse.url)

    fs.unlinkSync(localPath)

    return cloudinaryResponse
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)

    if (localPath) {
      fs.unlinkSync(localPath)
    }

    return null
  }
}

export { uploadOnCloudinary }