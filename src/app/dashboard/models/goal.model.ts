import { Category } from './category.model';

export interface Goal {
  id: number;
  userId: number;
  category: Category;
  categoryId: number;
  value: number;
  essentialExpenses: boolean;

  createdAt: Date;
  updatedAt: Date;
}
