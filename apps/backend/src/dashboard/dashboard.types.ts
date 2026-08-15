export interface DashboardPeriod {
  from: string;
  to: string;
}

export interface DashboardMetric {
  total: string;
}

export interface DashboardBalance {
  available: string;
}

export interface DashboardSummary {
  period: DashboardPeriod;
  income: DashboardMetric;
  expenses: DashboardMetric;
  balance: DashboardBalance;
  emergencyFund: {
    balance: string;
  };
}
