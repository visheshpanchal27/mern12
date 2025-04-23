<<<<<<< HEAD
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// 👇 create __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

=======
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

console.log('Loading ENV:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

>>>>>>> 72818dd476f79bebc98e6e1ec0e5ea3d11dedaed
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

<<<<<<< HEAD
export default cloudinary;
=======
export default cloudinary;
>>>>>>> 72818dd476f79bebc98e6e1ec0e5ea3d11dedaed
