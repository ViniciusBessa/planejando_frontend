import { Category } from './category.model';

export interface Goal {
  id: number;
  userId: number;
  category: Category;
  categoryId: number;
  value: number;
  essentialExpenses: boolean;
  sumExpenses: { month: number; total: number }[];

  createdAt: Date;
  updatedAt: Date;
}
