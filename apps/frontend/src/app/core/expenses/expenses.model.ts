export interface ExpenseCategory { id: number; name: string; userId: number | null; }

export interface Expense {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  amount: string;
  description: string | null;
  date: string;
  createdAt: string;
}

export interface ExpensePayload {
  categoryId: number;
  amount: string;
  description?: string;
  date: string;
}
