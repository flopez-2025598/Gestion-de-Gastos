export interface ReportPeriod { from: string; to: string; }
export interface ExpenseCategoryReport { categoryId: number; categoryName: string; total: string; }
export interface ExpensesByCategoryReport { period: ReportPeriod; total: string; categories: ExpenseCategoryReport[]; }
export interface IncomeVsExpensesReport { period: ReportPeriod; income: { total: string }; expenses: { total: string }; balance: { available: string }; }
