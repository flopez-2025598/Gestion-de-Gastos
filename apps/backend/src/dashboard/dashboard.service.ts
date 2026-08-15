import { Decimal } from 'decimal.js';
import { expensesService } from '../expenses/expenses.service.js';
import { emergencyFundService } from '../emergency-fund/emergency-fund.service.js';
import { incomeService } from '../income/income.service.js';
import type { DashboardSummary } from './dashboard.types.js';

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function toMoney(value: Decimal): string {
  return value.toFixed(2);
}

export const dashboardService = {
  async getSummary(userId: number): Promise<DashboardSummary> {
    const now = new Date();
    const periodFrom = startOfMonth(now);
    const periodTo = endOfMonth(now);

    const incomes = await incomeService.listForUser(userId);
    const expenses = await expensesService.listForUser(userId);
    const emergencyFund = await emergencyFundService.getFund(userId);

    const monthlyIncome = incomes
      .filter((income) => {
        const date = new Date(income.date);
        return date >= periodFrom && date <= periodTo;
      })
      .reduce((sum, income) => sum.plus(new Decimal(income.amount)), new Decimal(0));

    const monthlyExpenses = expenses
      .filter((expense) => {
        const date = new Date(expense.date);
        return date >= periodFrom && date <= periodTo;
      })
      .reduce((sum, expense) => sum.plus(new Decimal(expense.amount)), new Decimal(0));

    const availableBalance = monthlyIncome.minus(monthlyExpenses);

    return {
      period: {
        from: periodFrom.toISOString(),
        to: periodTo.toISOString(),
      },
      income: { total: toMoney(monthlyIncome) },
      expenses: { total: toMoney(monthlyExpenses) },
      balance: { available: toMoney(availableBalance) },
      emergencyFund: { balance: emergencyFund.balance },
    };
  },
};
