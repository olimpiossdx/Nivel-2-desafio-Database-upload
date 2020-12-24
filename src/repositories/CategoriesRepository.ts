import { EntityRepository, Repository } from 'typeorm';
import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async getCategory(title: string): Promise<Category | null> {
    const categoryExist = await this.findOne({ where: { title } });
    return categoryExist || null;
  }
}

export default CategoryRepository;
