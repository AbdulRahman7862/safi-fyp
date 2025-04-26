import express from 'express';
import dealsCategoryController from '../controller/category_controller.js';

const router = express.Router();

router.get('/deals-category', dealsCategoryController.getAllCategories);

export default router;