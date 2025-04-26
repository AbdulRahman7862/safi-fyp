import DealsCategory from '../model/deal_category_model.js';

class DealsCategoryService {
  async getAllCategories() {
    try {
      const categories = await DealsCategory.findAll({
        attributes: ['category_name', 'image'],  
        order: [['category_name', 'ASC']],
      });
      return categories;
    } catch (error) {
      throw new Error('Error fetching categories: ' + error.message);
    }
  }
}

export default new DealsCategoryService();