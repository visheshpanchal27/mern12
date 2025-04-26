import express from 'express';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage(); // store file in memory

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const fileStr = req.file.buffer.toString('base64');
    const uploadedResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileStr}`, {
      folder: 'vishesh-store', // optional: cloudinary folder
    });

    res.json({ image: uploadedResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error: ' + error.message);
  }
});

export default router;
