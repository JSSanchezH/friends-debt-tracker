export interface Debt {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description?: string;
  dueDate?: string;
  paid: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
