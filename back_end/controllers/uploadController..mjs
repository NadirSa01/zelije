import multer from "multer";
import { uploadImage } from "../utils/minioClient.mjs";

const upload = multer({storage: multer.memoryStorage()})

export const uploadProductImage =async (req,res)=>{
    try {
        const file = req.file;
        const imageUrl=await uploadImage(file,file.originalname);
        res.json({message:"Image uploaded successfully",imageUrl});
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({message:"Error uploading image"});
    }
}
export const uploadMiddleware = upload.single('image');