import { Loan, Payment, UserProfile, UserAchievement, Alert, OptimizationPlan, Milestone } from '../types';

const STORAGE_KEYS = {
  USER: 'finliberate_user',
  LOANS: 'finliberate_loans',
  PAYMENTS: 'finliberate_payments',
  ACHIEVEMENTS: 'finliberate_achievements',
  ALERTS: 'finliberate_alerts',
  PLANS: 'finliberate_plans',
  MILESTONES: 'finliberate_milestones',
};

export const storage = {
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getLoans: (): Loan[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOANS);
    return data ? JSON.parse(data) : [];
  },

  setLoans: (loans: Loan[]) => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  },

  addLoan: (loan: Loan) => {
    const loans = storage.getLoans();
    loans.push(loan);
    storage.setLoans(loans);
  },

  updateLoan: (loanId: string, updates: Partial<Loan>) => {
    const loans = storage.getLoans();
    const index = loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
      loans[index] = { ...loans[index], ...updates };
      storage.setLoans(loans);
    }
  },

  getLoan: (loanId: string): Loan | null => {
    const loans = storage.getLoans();
    return loans.find(l => l.id === loanId) || null;
  },

  getPayments: (): Payment[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? JSON.parse(data) : [];
  },

  setPayments: (payments: Payment[]) => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },

  addPayment: (payment: Payment) => {
    const payments = storage.getPayments();
    payments.push(payment);
    storage.setPayments(payments);
  },

  getPaymentsForLoan: (loanId: string): Payment[] => {
    const payments = storage.getPayments();
    return payments.filter(p => p.loanId === loanId);
  },

  getAchievements: (): UserAchievement[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  },

  setAchievements: (achievements: UserAchievement[]) => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  addAchievement: (achievement: UserAchievement) => {
    const achievements = storage.getAchievements();
    achievements.push(achievement);
    storage.setAchievements(achievements);
  },

  getAlerts: (): Alert[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return data ? JSON.parse(data) : [];
  },

  setAlerts: (alerts: Alert[]) => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  },

  addAlert: (alert: Alert) => {
    const alerts = storage.getAlerts();
    alerts.push(alert);
    storage.setAlerts(alerts);
  },

  markAlertAsRead: (alertId: string) => {
    const alerts = storage.getAlerts();
    const index = alerts.findIndex(a => a.id === alertId);
    if (index !== -1) {
      alerts[index].isRead = true;
      storage.setAlerts(alerts);
    }
  },

  getPlans: (): OptimizationPlan[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PLANS);
    return data ? JSON.parse(data) : [];
  },

  setPlans: (plans: OptimizationPlan[]) => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  },

  addPlan: (plan: OptimizationPlan) => {
    const plans = storage.getPlans();
    plans.push(plan);
    storage.setPlans(plans);
  },

  getMilestones: (): Milestone[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    return data ? JSON.parse(data) : [];
  },

  setMilestones: (milestones: Milestone[]) => {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  },

  updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => {
    const milestones = storage.getMilestones();
    const index = milestones.findIndex(m => m.id === milestoneId);
    if (index !== -1) {
      milestones[index] = { ...milestones[index], ...updates };
      storage.setMilestones(milestones);
    }
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
