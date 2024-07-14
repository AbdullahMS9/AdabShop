import express from "express";
const router = express.Router();
import {
    getProducts,
    getProductById,
    createProduct,
    editProduct
} from '../controllers/productController.js';
import { protect, admin } from "../middleware/authMiddleware.js";

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductById).put(protect, admin, editProduct);

export default router;