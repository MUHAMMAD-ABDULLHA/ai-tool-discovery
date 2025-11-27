import cloudinary from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.MYCLOUDINARYNAME, 
  api_key: process.env.CLOUDINARYAPIKEY, 
  api_secret: process.env.CLOUDINARYSECRETKEY
});