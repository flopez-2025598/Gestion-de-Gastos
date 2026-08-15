export interface EmergencyFundOutput {
  id: number;
  userId: number;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovementInput {
  amount: string;
  description?: string;
}

export interface MovementOutput {
  id: number;
  emergencyFundId: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: string;
  date: Date;
  description: string | null;
  createdAt: Date;
}