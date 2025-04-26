import express from "express";
const router = express.Router()
import { 
    createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory
} from "../controllers/categoryControllers.js";

import { authentication, authorizeAdmin } from "../middlewares/authMiddleware.js";
import { updateCurrentUserProfile } from "../controllers/userController.js";

router.route('/').post(authentication,authorizeAdmin,createCategory);
router.route('/:categoryId').put(authentication,authorizeAdmin,updateCategory);
router
    .route('/:categoryId')
    .delete(authentication,authorizeAdmin,removeCategory);
router.route('/categories').get(listCategory);
router.route('/:id').get(readCategory);
router.route('/:categoryId').get(readCategory);
export default router;