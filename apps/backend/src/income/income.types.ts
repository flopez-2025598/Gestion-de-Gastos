export interface IncomeSourceOutput {
  id: number;
  name: string;
  userId: number | null;
}

export interface CreateIncomeSourceInput {
  name: string;
}

export interface CreateIncomeInput {
  incomeSourceId: number;
  type: 'FIXED' | 'VARIABLE' | 'EXTRAORDINARY';
  amount: string;
  description?: string;
  date: string;
}

export interface UpdateIncomeInput {
  incomeSourceId?: number;
  type?: 'FIXED' | 'VARIABLE' | 'EXTRAORDINARY';
  amount?: string;
  description?: string;
  date?: string;
}

export interface IncomeOutput {
  id: number;
  userId: number;
  incomeSourceId: number;
  incomeSourceName: string;
  type: string;
  amount: string;
  description: string | null;
  date: Date;
  createdAt: Date;
}