import { expensesRepository } from './expenses.repository.js';
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseOutput,
  CreateExpenseCategoryInput,
  ExpenseCategoryOutput,
} from './expenses.types.js';

function toExpenseOutput(expense: {
  id: number;
  userId: number;
  categoryId: number;
  category: { name: string };
  amount: unknown;
  description: string | null;
  date: Date;
  createdAt: Date;
}): ExpenseOutput {
  return {
    id: expense.id,
    userId: expense.userId,
    categoryId: expense.categoryId,
    categoryName: expense.category.name,
    amount: (expense.amount as { toString(): string }).toString(),
    description: expense.description,
    date: expense.date,
    createdAt: expense.createdAt,
  };
}

export const expensesService = {
  async listCategories(userId: number): Promise<ExpenseCategoryOutput[]> {
    const categories = await expensesRepository.findCategoriesForUser(userId);
    return categories.map((c) => ({ id: c.id, name: c.name, userId: c.userId }));
  },

  async createCategory(userId: number, input: CreateExpenseCategoryInput): Promise<ExpenseCategoryOutput> {
    const category = await expensesRepository.createCategory(userId, input.name);
    return { id: category.id, name: category.name, userId: category.userId };
  },

  async create(userId: number, input: CreateExpenseInput): Promise<ExpenseOutput> {
    const category = await expensesRepository.findCategoryById(input.categoryId);
    if (!category) {
      throw new Error('EXPENSE_CATEGORY_NOT_FOUND');
    }
    if (category.userId !== null && category.userId !== userId) {
      throw new Error('EXPENSE_CATEGORY_NOT_FOUND');
    }

    const expense = await expensesRepository.create(userId, {
      categoryId: input.categoryId,
      amount: input.amount,
      date: new Date(input.date),
      ...(input.description !== undefined && { description: input.description }),
    });

    return toExpenseOutput(expense);
  },

  async listForUser(userId: number): Promise<ExpenseOutput[]> {
    const expenses = await expensesRepository.findAllByUser(userId);
    return expenses.map(toExpenseOutput);
  },

  async getOne(id: number, userId: number): Promise<ExpenseOutput> {
    const expense = await expensesRepository.findByIdForUser(id, userId);
    if (!expense) {
      throw new Error('EXPENSE_NOT_FOUND');
    }
    return toExpenseOutput(expense);
  },

  async update(id: number, userId: number, input: UpdateExpenseInput): Promise<ExpenseOutput> {
    const existing = await expensesRepository.findByIdForUser(id, userId);
    if (!existing) {
      throw new Error('EXPENSE_NOT_FOUND');
    }

    const data: Record<string, unknown> = {};
    if (input.categoryId !== undefined) data.categoryId = input.categoryId;
    if (input.amount !== undefined) data.amount = input.amount;
    if (input.description !== undefined) data.description = input.description;
    if (input.date !== undefined) data.date = new Date(input.date);

    const updated = await expensesRepository.update(id, data);
    return toExpenseOutput(updated);
  },

  async remove(id: number, userId: number): Promise<void> {
    const existing = await expensesRepository.findByIdForUser(id, userId);
    if (!existing) {
      throw new Error('EXPENSE_NOT_FOUND');
    }
    await expensesRepository.delete(id);
  },
};