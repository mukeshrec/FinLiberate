import { AmortizationSchedule, Loan } from '../types';

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return Math.round(emi * 100) / 100;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  emiAmount?: number
): AmortizationSchedule[] {
  const schedule: AmortizationSchedule[] = [];
  const monthlyRate = annualRate / 12 / 100;
  const emi = emiAmount || calculateEMI(principal, annualRate, tenureMonths);

  let balance = principal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (let month = 1; month <= tenureMonths && balance > 0; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(emi - interestPayment, balance);
    balance -= principalPayment;
    cumulativePrincipal += principalPayment;
    cumulativeInterest += interestPayment;

    schedule.push({
      month,
      year: Math.floor((month - 1) / 12) + 1,
      payment: principalPayment + interestPayment,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
      cumulativePrincipal: Math.round(cumulativePrincipal * 100) / 100,
      cumulativeInterest: Math.round(cumulativeInterest * 100) / 100,
    });
  }

  return schedule;
}

export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const totalPayment = emi * tenureMonths;
  return Math.round((totalPayment - principal) * 100) / 100;
}

export function calculatePrepaymentImpact(
  currentBalance: number,
  annualRate: number,
  remainingMonths: number,
  emiAmount: number,
  extraAmount: number,
  strategy: 'reduce_tenure' | 'reduce_emi' = 'reduce_tenure'
): {
  newEmi: number;
  newTenure: number;
  interestSaved: number;
  monthsSaved: number;
} {
  const monthlyRate = annualRate / 12 / 100;
  const newBalance = currentBalance - extraAmount;

  if (strategy === 'reduce_tenure') {
    let balance = newBalance;
    let months = 0;

    while (balance > 0 && months < remainingMonths) {
      const interest = balance * monthlyRate;
      const principal = Math.min(emiAmount - interest, balance);
      balance -= principal;
      months++;
    }

    const originalInterest = calculateTotalInterest(currentBalance, annualRate, remainingMonths);
    const newInterest = calculateTotalInterest(newBalance, annualRate, months);

    return {
      newEmi: emiAmount,
      newTenure: months,
      interestSaved: Math.round((originalInterest - newInterest) * 100) / 100,
      monthsSaved: remainingMonths - months,
    };
  } else {
    const newEmi = calculateEMI(newBalance, annualRate, remainingMonths);
    const originalInterest = calculateTotalInterest(currentBalance, annualRate, remainingMonths);
    const newInterest = calculateTotalInterest(newBalance, annualRate, remainingMonths);

    return {
      newEmi: Math.round(newEmi * 100) / 100,
      newTenure: remainingMonths,
      interestSaved: Math.round((originalInterest - newInterest) * 100) / 100,
      monthsSaved: 0,
    };
  }
}

export function calculateExtraMonthlyPaymentImpact(
  currentBalance: number,
  annualRate: number,
  remainingMonths: number,
  currentEmi: number,
  extraMonthlyAmount: number
): {
  monthsSaved: number;
  interestSaved: number;
  newTenure: number;
} {
  const monthlyRate = annualRate / 12 / 100;
  const newEmi = currentEmi + extraMonthlyAmount;

  let balance = currentBalance;
  let months = 0;

  while (balance > 0 && months < remainingMonths * 2) {
    const interest = balance * monthlyRate;
    const principal = Math.min(newEmi - interest, balance);
    balance -= principal;
    months++;
  }

  const originalInterest = calculateTotalInterest(currentBalance, annualRate, remainingMonths);
  const newInterest = (newEmi * months) - currentBalance;

  return {
    monthsSaved: remainingMonths - months,
    interestSaved: Math.round((originalInterest - newInterest) * 100) / 100,
    newTenure: months,
  };
}

export function calculateProgressPercentage(loan: Loan): number {
  const paid = loan.totalPrincipalPaid;
  const total = loan.originalAmount;
  return Math.round((paid / total) * 100 * 100) / 100;
}

export function calculateMonthsBetweenDates(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();

  return yearDiff * 12 + monthDiff;
}

export function addMonthsToDate(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

export function formatCurrency(amount: number, showDecimals = false): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)}K`;
  }

  return formatted;
}

export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  const d = new Date(date);

  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDaysUntil(targetDate: Date): number {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
