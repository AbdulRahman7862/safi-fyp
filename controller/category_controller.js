import dealsCategoryService from '../services/category_service.js';

class DealsCategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await dealsCategoryService.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching categories',
        error: error.message,
      });
    }
  }
}

export default new DealsCategoryController();