import { GoogleGenerativeAI } from '@google/generative-ai';
import { LoanData } from '../types/chatbot';

const API_KEY = 'AIzaSyBJFo_5Um9KSQgvoO9omyAL9Z_2JdSSU5k';
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateLoanInsights = async (
  userMessage: string,
  loanData?: LoanData
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const context = loanData
      ? `
Current Loan Information:
- Principal Amount: ₹${loanData.principal.toLocaleString('en-IN')}
- Interest Rate: ${loanData.interestRate}% per annum
- EMI Amount: ₹${loanData.emiAmount.toLocaleString('en-IN')}
- Tenure: ${loanData.tenure} months
${loanData.remainingTenure ? `- Remaining Tenure: ${loanData.remainingTenure} months` : ''}
${loanData.totalInterest ? `- Total Interest: ₹${loanData.totalInterest.toLocaleString('en-IN')}` : ''}
${loanData.totalAmount ? `- Total Amount Payable: ₹${loanData.totalAmount.toLocaleString('en-IN')}` : ''}

You are a helpful financial assistant specializing in loan repayment strategies. Provide clear, actionable advice based on the loan data above.
`
      : 'You are a helpful financial assistant specializing in loan repayment strategies.';

    const prompt = `${context}\n\nUser Question: ${userMessage}\n\nProvide a helpful, concise response with specific recommendations when applicable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};

export const generateLoanAnalysis = async (loanData: LoanData): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Analyze this loan and provide optimization suggestions:

Loan Details:
- Principal: ₹${loanData.principal.toLocaleString('en-IN')}
- Interest Rate: ${loanData.interestRate}% per annum
- EMI: ₹${loanData.emiAmount.toLocaleString('en-IN')}
- Tenure: ${loanData.tenure} months

Please provide:
1. Overview of the loan structure
2. Total interest payable
3. Prepayment strategies to reduce interest
4. Optimal prepayment amounts and timing
5. Potential savings through various strategies

Format the response in a clear, structured manner.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate loan analysis.');
  }
};
