import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Loan, Payment, UserAchievement, Alert } from '../types';
import { storage } from '../utils/storage';
import { MOCK_ACHIEVEMENTS } from '../utils/mockData';

interface AppContextType {
  user: UserProfile | null;
  loans: Loan[];
  payments: Payment[];
  achievements: UserAchievement[];
  alerts: Alert[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  addLoan: (loan: Loan) => void;
  updateLoan: (loanId: string, updates: Partial<Loan>) => void;
  getLoan: (loanId: string) => Loan | undefined;
  addPayment: (payment: Payment) => void;
  unlockAchievement: (achievementCode: string) => void;
  markAlertAsRead: (alertId: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      loadUserData();
    }
  }, []);

  const loadUserData = () => {
    setLoans(storage.getLoans());
    setPayments(storage.getPayments());
    setAchievements(storage.getAchievements());
    setAlerts(storage.getAlerts());
  };

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingUser = storage.getUser();
    if (existingUser && existingUser.email === email) {
      setUser(existingUser);
      setIsAuthenticated(true);
      loadUserData();
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      level: 1,
      points: 0,
      currentStreak: 0,
      longestStreak: 0,
    };

    storage.setUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setLoans([]);
    setPayments([]);
    setAchievements([]);
    setAlerts([]);
  };

  const addLoan = (loan: Loan) => {
    storage.addLoan(loan);
    setLoans(prev => [...prev, loan]);

    checkAndUnlockAchievements();
  };

  const updateLoan = (loanId: string, updates: Partial<Loan>) => {
    storage.updateLoan(loanId, updates);
    setLoans(prev =>
      prev.map(loan => (loan.id === loanId ? { ...loan, ...updates } : loan))
    );
  };

  const getLoan = (loanId: string) => {
    return loans.find(l => l.id === loanId);
  };

  const addPayment = (payment: Payment) => {
    storage.addPayment(payment);
    setPayments(prev => [...prev, payment]);

    if (payment.isExtraPayment) {
      unlockAchievement('first_prepayment');
    } else {
      if (user) {
        const newStreak = user.currentStreak + 1;
        updateUserProfile({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, user.longestStreak),
        });

        if (newStreak === 3) unlockAchievement('streak_3');
        if (newStreak === 6) unlockAchievement('streak_6');
        if (newStreak === 12) unlockAchievement('streak_12');
      }
    }

    checkAndUnlockAchievements();
  };

  const unlockAchievement = (achievementCode: string) => {
    const achievement = MOCK_ACHIEVEMENTS.find(a => a.code === achievementCode);
    if (!achievement || !user) return;

    const alreadyUnlocked = achievements.some(
      ua => ua.achievement.code === achievementCode
    );
    if (alreadyUnlocked) return;

    const userAchievement: UserAchievement = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      achievementId: achievement.id,
      achievement,
      unlockedAt: new Date(),
      shared: false,
    };

    storage.addAchievement(userAchievement);
    setAchievements(prev => [...prev, userAchievement]);

    updateUserProfile({
      points: user.points + achievement.points,
      level: Math.floor((user.points + achievement.points) / 100) + 1,
    });
  };

  const checkAndUnlockAchievements = () => {
    if (!user) return;

    const totalLoans = loans.length;
    const totalPayments = payments.length;
    const extraPayments = payments.filter(p => p.isExtraPayment).length;
    const totalInterestSaved = loans.reduce((sum, loan) => sum + loan.interestSaved, 0);
    const totalMonthsSaved = loans.reduce((sum, loan) => sum + loan.monthsAccelerated, 0);

    if (totalLoans >= 1) unlockAchievement('first_loan');
    if (totalPayments >= 1) unlockAchievement('first_payment');
    if (extraPayments >= 1) unlockAchievement('first_prepayment');
    if (totalInterestSaved >= 50000) unlockAchievement('saved_50k');
    if (totalInterestSaved >= 100000) unlockAchievement('saved_1l');
    if (totalInterestSaved >= 500000) unlockAchievement('saved_5l');
    if (totalMonthsSaved >= 6) unlockAchievement('months_saved_6');
    if (totalMonthsSaved >= 12) unlockAchievement('months_saved_12');
    if (totalMonthsSaved >= 24) unlockAchievement('months_saved_24');

    loans.forEach(loan => {
      const progress = (loan.totalPrincipalPaid / loan.originalAmount) * 100;
      if (progress >= 25) unlockAchievement('quarter_complete');
      if (progress >= 50) unlockAchievement('half_complete');
      if (progress >= 75) unlockAchievement('three_quarter_complete');
      if (progress >= 90) unlockAchievement('almost_free');
    });
  };

  const markAlertAsRead = (alertId: string) => {
    storage.markAlertAsRead(alertId);
    setAlerts(prev =>
      prev.map(alert => (alert.id === alertId ? { ...alert, isRead: true } : alert))
    );
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    storage.setUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loans,
        payments,
        achievements,
        alerts,
        isAuthenticated,
        login,
        signup,
        logout,
        addLoan,
        updateLoan,
        getLoan,
        addPayment,
        unlockAchievement,
        markAlertAsRead,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
