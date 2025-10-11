export interface Loan {
  id: string;
  userId: string;
  loanName: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  tenureMonths: number;
  remainingMonths: number;
  emiAmount: number;
  startDate: Date;
  originalEndDate: Date;
  projectedEndDate: Date;
  goalEndDate?: Date;
  totalInterestOriginal: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  interestSaved: number;
  monthsAccelerated: number;
  status: 'active' | 'closed' | 'refinanced';
  bankName?: string;
}

export interface Payment {
  id: string;
  loanId: string;
  userId: string;
  paymentDate: Date;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  paymentType: 'emi' | 'prepayment' | 'lump_sum';
  isExtraPayment: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'prepayment' | 'streak' | 'savings' | 'speed';
  icon: string;
  points: number;
  criteria: Record<string, any>;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: Date;
  shared: boolean;
}

export interface Alert {
  id: string;
  userId: string;
  loanId?: string;
  alertType: 'rate_change' | 'nudge' | 'milestone' | 'streak';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface OptimizationPlan {
  id: string;
  loanId: string;
  userId: string;
  planType: 'monthly_extra' | 'lump_sum' | 'refinance';
  amount: number;
  strategy: 'reduce_tenure' | 'reduce_emi';
  interestSaved: number;
  monthsSaved: number;
  newEndDate: Date;
  status: 'suggested' | 'active' | 'completed';
}

export interface Milestone {
  id: string;
  loanId: string;
  userId: string;
  milestoneType: '25_percent' | '50_percent' | '75_percent' | '90_percent';
  achievedAt?: Date;
  celebrated: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  level: number;
  points: number;
  currentStreak: number;
  longestStreak: number;
}

export interface AmortizationSchedule {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}
