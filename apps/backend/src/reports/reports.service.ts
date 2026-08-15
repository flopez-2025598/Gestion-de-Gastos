import { Decimal } from 'decimal.js';
import { expensesService } from '../expenses/expenses.service.js';
import { emergencyFundService } from '../emergency-fund/emergency-fund.service.js';
import { incomeService } from '../income/income.service.js';
import type {
  ExpensesByCategoryReport,
  IncomeVsExpensesReport,
  ReportPeriod,
} from './reports.types.js';

function normalizeDate(dateValue: string | undefined, fallback: 'start' | 'end'): Date {
  const parsed = dateValue ? new Date(dateValue) : new Date();

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('INVALID_DATE');
  }

  if (!dateValue) {
    if (fallback === 'start') {
      return new Date(parsed.getFullYear(), parsed.getMonth(), 1, 0, 0, 0, 0);
    }
    return new Date(parsed.getFullYear(), parsed.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  return parsed;
}

function getDefaultPeriod(): { from: Date; to: Date } {
  const now = new Date();
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}

function buildPeriod(fromInput?: string, toInput?: string): { from: Date; to: Date; period: ReportPeriod } {
  if (!fromInput && !toInput) {
    const defaultPeriod = getDefaultPeriod();
    return {
      from: defaultPeriod.from,
      to: defaultPeriod.to,
      period: {
        from: defaultPeriod.from.toISOString(),
        to: defaultPeriod.to.toISOString(),
      },
    };
  }

  const from = normalizeDate(fromInput, 'start');
  const to = normalizeDate(toInput, 'end');

  if (from > to) {
    throw new Error('INVALID_PERIOD');
  }

  return {
    from,
    to,
    period: {
      from: from.toISOString(),
      to: to.toISOString(),
    },
  };
}

function toMoney(value: Decimal): string {
  return value.toFixed(2);
}

export const reportsService = {
  async getExpensesByCategory(userId: number, from?: string, to?: string): Promise<ExpensesByCategoryReport> {
    const { from: fromDate, to: toDate, period } = buildPeriod(from, to);

    const expenses = await expensesService.listForUser(userId);
    const filtered = expenses.filter((expense) => {
      const date = new Date(expense.date);
      return date >= fromDate && date <= toDate;
    });

    const totalsByCategory = new Map<number, { categoryId: number; categoryName: string; total: Decimal }>();

    for (const expense of filtered) {
      const key = expense.categoryId;
      const current = totalsByCategory.get(key);
      const amount = new Decimal(expense.amount);

      if (current) {
        current.total = current.total.plus(amount);
      } else {
        totalsByCategory.set(key, {
          categoryId: key,
          categoryName: expense.categoryName,
          total: amount,
        });
      }
    }

    const categories = Array.from(totalsByCategory.values())
      .map((item) => ({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        total: toMoney(item.total),
      }))
      .sort((a, b) => new Decimal(b.total).minus(new Decimal(a.total)).toNumber());

    const total = categories.reduce((sum, item) => sum.plus(new Decimal(item.total)), new Decimal(0));

    return {
      period,
      total: toMoney(total),
      categories,
    };
  },

  async getIncomeVsExpenses(userId: number, from?: string, to?: string): Promise<IncomeVsExpensesReport> {
    const { from: fromDate, to: toDate, period } = buildPeriod(from, to);

    const incomes = await incomeService.listForUser(userId);
    const expenses = await expensesService.listForUser(userId);
    const fundMovements = await emergencyFundService.listMovements(userId);

    const incomeTotal = incomes
      .filter((income) => {
        const date = new Date(income.date);
        return date >= fromDate && date <= toDate;
      })
      .reduce((sum, income) => sum.plus(new Decimal(income.amount)), new Decimal(0));

    const expensesTotal = expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return date >= fromDate && date <= toDate;
      })
      .reduce((sum, expense) => sum.plus(new Decimal(expense.amount)), new Decimal(0));

    const fundMovementTotal = fundMovements
      .filter((movement) => {
        const date = new Date(movement.date);
        return date >= fromDate && date <= toDate;
      })
      .reduce((sum, movement) => movement.type === 'DEPOSIT'
        ? sum.minus(new Decimal(movement.amount))
        : sum.plus(new Decimal(movement.amount)), new Decimal(0));

    const availableBalance = incomeTotal.minus(expensesTotal).plus(fundMovementTotal);

    return {
      period,
      income: { total: toMoney(incomeTotal) },
      expenses: { total: toMoney(expensesTotal) },
      balance: { available: toMoney(availableBalance) },
    };
  },
};
