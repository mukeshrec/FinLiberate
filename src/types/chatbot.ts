export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface LoanData {
  principal: number;
  interestRate: number;
  emiAmount: number;
  tenure: number;
  remainingTenure?: number;
  totalInterest?: number;
  totalAmount?: number;
}

export interface ChatBotProps {
  loanData?: LoanData;
}
