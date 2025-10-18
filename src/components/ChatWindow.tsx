import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, FileText } from 'lucide-react';
import { ChatMessage, LoanData } from '../types/chatbot';
import { generateLoanInsights, generateLoanAnalysis } from '../services/geminiService';
import { generateLoanRoadmapPDF } from '../services/pdfGenerator';

interface ChatWindowProps {
  loanData?: LoanData;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ loanData, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: loanData
        ? `Hello! I'm your AI loan advisor. I can see you have a loan of ₹${loanData.principal.toLocaleString('en-IN')} at ${loanData.interestRate}% interest. How can I help you optimize your repayment strategy today?`
        : "Hello! I'm your AI loan advisor. How can I help you with your loan today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateLoanInsights(input.trim(), loanData);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!loanData || isPdfGenerating) return;

    setIsPdfGenerating(true);

    try {
      const insights = await generateLoanAnalysis(loanData);
      generateLoanRoadmapPDF(loanData, insights);

      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Your loan repayment roadmap PDF has been generated and downloaded successfully!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Failed to generate PDF. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Loan Freedom AI</h3>
            <p className="text-xs text-blue-100">Your Financial Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-800 rounded-full p-1 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* PDF Button */}
      {loanData && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleGeneratePDF}
            disabled={isPdfGenerating}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isPdfGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Generating PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Generate PDF Roadmap</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your loan..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
