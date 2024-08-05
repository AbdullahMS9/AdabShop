import express from "express";
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
    authUserWithGoogle
} from '../controllers/userController.js';
import { protect, admin } from "../middleware/authMiddleware.js";

router.route('/').post(registerUser).get(protect, admin, getUsers);
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);


router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.post('/auth/google', authUserWithGoogle);

export default router;