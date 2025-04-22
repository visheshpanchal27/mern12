import express from 'express';
import { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile ,updateCurrentUserProfile,deleteUserById,getUserById, updateUserById, saveUserFavorites, getUserFavorites} from '../controllers/userController.js';
import { authentication, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(createUser).get(authentication, authorizeAdmin, getAllUsers);


router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.route('/profile').get(authentication, getCurrentUserProfile).put(authentication, updateCurrentUserProfile);

router.route('/favorites')
  .get(protect, getUserFavorites)
  .post(protect, saveUserFavorites);
  
//admin routes
router.route('/:id').delete(authentication, authorizeAdmin, deleteUserById)
    .get(authentication, authorizeAdmin, getUserById)
    .put(authentication, authorizeAdmin, updateUserById);


export default router;
