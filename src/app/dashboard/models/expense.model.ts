import { Category } from './category.model';

export interface Expense {
  id: number;
  userId: number;
  category: Category;
  categoryId: number;
  value: number;
  description: string;
  isEssential: boolean;

  createdAt: Date;
  updatedAt: Date;
}
