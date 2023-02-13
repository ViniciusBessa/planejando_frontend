export interface Revenue {
  id: number;
  userId: number;
  value: number;
  date: Date;
  description: string;

  createdAt: Date;
  updatedAt: Date;
}
