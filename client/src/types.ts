export interface User {
  _id: string;
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Expense {
  _id: string;
  user: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Healthcare'
  | 'Education'
  | 'Other';

export interface DashboardData {
  totalExpenses: { total: number; count: number };
  monthlyExpenses: { total: number; count: number };
  recentTransactions: Expense[];
}

export interface ExpenseFormData {
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}
