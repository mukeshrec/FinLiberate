import { Loan } from '../types';
import { LoanData } from '../types/chatbot';

export const convertLoanToChatbotFormat = (loan: Loan): LoanData => {
  return {
    principal: loan.currentBalance,
    interestRate: loan.interestRate,
    emiAmount: loan.emiAmount,
    tenure: loan.tenureMonths,
    remainingTenure: loan.remainingMonths,
    totalInterest: loan.totalInterestOriginal,
    totalAmount: loan.currentBalance + (loan.totalInterestOriginal - loan.totalInterestPaid),
  };
};

export const getPrimaryLoanData = (loans: Loan[]): LoanData | undefined => {
  if (loans.length === 0) return undefined;

  const activeLoan = loans.find(loan => loan.status === 'active');
  return activeLoan ? convertLoanToChatbotFormat(activeLoan) : convertLoanToChatbotFormat(loans[0]);
};
