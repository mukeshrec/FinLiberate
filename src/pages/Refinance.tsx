import { useState } from 'react';
import { RefreshCw, TrendingDown, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_BANKS } from '../utils/mockData';
import { calculateTotalInterest, formatCurrency } from '../utils/loanCalculations';

export function Refinance() {
  const { loans } = useApp();
  const activeLoan = loans.find((l) => l.status === 'active');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  if (!activeLoan) {
    return <div className="text-center py-12 text-gray-600">No active loan found</div>;
  }

  const currentRate = activeLoan.interestRate;
  const betterRates = MOCK_BANKS.filter((bank) => bank.currentRate < currentRate);

  const calculateSavings = (newRate: number) => {
    const currentInterest = calculateTotalInterest(
      activeLoan.currentBalance,
      currentRate,
      activeLoan.remainingMonths
    );
    const newInterest = calculateTotalInterest(
      activeLoan.currentBalance,
      newRate,
      activeLoan.remainingMonths
    );
    return currentInterest - newInterest;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refinancing Assistant</h1>
        <p className="text-gray-600">Find better rates and save more</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Lower Rates Available!
            </h3>
            <p className="text-gray-700">
              Your current rate is <strong>{currentRate}%</strong>. We found{' '}
              <strong>{betterRates.length}</strong> bank{betterRates.length > 1 ? 's' : ''} offering
              lower rates. You could save lakhs by refinancing!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Current Loan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Bank</p>
            <p className="text-lg font-semibold text-gray-900">{activeLoan.bankName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Interest Rate</p>
            <p className="text-lg font-semibold text-gray-900">{currentRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining Balance</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(activeLoan.currentBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining Tenure</p>
            <p className="text-lg font-semibold text-gray-900">
              {Math.floor(activeLoan.remainingMonths / 12)}y {activeLoan.remainingMonths % 12}m
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Better Rates Available</h2>
        <div className="space-y-4">
          {MOCK_BANKS.sort((a, b) => a.currentRate - b.currentRate).map((bank) => {
            const savings = calculateSavings(bank.currentRate);
            const isBetter = bank.currentRate < currentRate;

            return (
              <button
                key={bank.name}
                onClick={() => isBetter && setSelectedBank(bank.name)}
                disabled={!isBetter}
                className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                  selectedBank === bank.name
                    ? 'border-green-500 bg-green-50'
                    : isBetter
                    ? 'border-gray-300 hover:border-green-300'
                    : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{bank.name}</h3>
                      {isBetter && bank.currentRate === Math.min(...MOCK_BANKS.map((b) => b.currentRate)) && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">
                          Best Rate
                        </span>
                      )}
                      {!isBetter && (
                        <span className="px-3 py-1 bg-gray-400 text-white text-xs rounded-full">
                          Current Bank
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{bank.currentRate}%</p>
                      </div>
                      {isBetter && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600">You Save</p>
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(savings)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Rate Difference</p>
                            <p className="text-2xl font-bold text-blue-600">
                              -{(currentRate - bank.currentRate).toFixed(2)}%
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    {isBetter && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Save {formatCurrency(savings)} over remaining tenure</span>
                      </div>
                    )}
                  </div>
                  {isBetter && (
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedBank && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Refinancing Checklist</h2>
          <div className="space-y-4">
            {[
              'Check eligibility criteria with the new bank',
              'Calculate processing fees and other charges',
              'Gather required documents (ID, income proof, property papers)',
              'Get loan sanction letter from new bank',
              'Apply for foreclosure with current bank',
              'Complete refinancing process',
            ].map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-semibold">{index + 1}</span>
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Factor in processing fees (typically 0.5-1% of loan amount) when
              calculating total savings. Refinancing makes sense if you save more than the switching
              costs.
            </p>
          </div>

          <button className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all">
            Start Refinancing with {selectedBank}
          </button>
        </div>
      )}
    </div>
  );
}
