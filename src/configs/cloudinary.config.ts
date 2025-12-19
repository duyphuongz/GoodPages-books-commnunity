// Require the cloudinary library
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Return "https" URLs by setting secure: true
cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Log the configuration
console.log(cloudinary.config());

export default cloudinary;