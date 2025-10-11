import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculatePrepaymentImpact, formatCurrency, addMonthsToDate } from '../utils/loanCalculations';
import { Zap, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export function PrepaymentPlanner() {
  const { loans, addPayment, updateLoan } = useApp();
  const activeLoan = loans.find((l) => l.status === 'active');
  const [amount, setAmount] = useState(50000);
  const [paymentType, setPaymentType] = useState<'lump_sum' | 'monthly'>('lump_sum');
  const [strategy, setStrategy] = useState<'reduce_tenure' | 'reduce_emi'>('reduce_tenure');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!activeLoan) {
    return <div className="text-center py-12 text-gray-600">No active loan found</div>;
  }

  const impact = calculatePrepaymentImpact(
    activeLoan.currentBalance,
    activeLoan.interestRate,
    activeLoan.remainingMonths,
    activeLoan.emiAmount,
    amount,
    strategy
  );

  const suggestedPlans = [
    { amount: 1000, label: 'Starter', description: 'Easy on budget', effort: 'Low' },
    { amount: 3000, label: 'Recommended', description: 'Balanced approach', effort: 'Medium' },
    { amount: 5000, label: 'Aggressive', description: 'Maximum impact', effort: 'High' },
  ];

  const handlePrepayment = () => {
    if (!activeLoan) return;

    const payment = {
      id: Math.random().toString(36).substr(2, 9),
      loanId: activeLoan.id,
      userId: activeLoan.userId,
      paymentDate: new Date(),
      amount,
      principalAmount: amount,
      interestAmount: 0,
      paymentType: paymentType === 'lump_sum' ? ('lump_sum' as const) : ('prepayment' as const),
      isExtraPayment: true,
    };

    addPayment(payment);

    updateLoan(activeLoan.id, {
      currentBalance: activeLoan.currentBalance - amount,
      totalPrincipalPaid: activeLoan.totalPrincipalPaid + amount,
      interestSaved: activeLoan.interestSaved + impact.interestSaved,
      monthsAccelerated: activeLoan.monthsAccelerated + impact.monthsSaved,
      remainingMonths: impact.newTenure,
      projectedEndDate: addMonthsToDate(new Date(), impact.newTenure),
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Prepayment Planner</h1>
        <p className="text-gray-600">Calculate the impact of extra payments</p>
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600">
            You just saved {formatCurrency(impact.interestSaved)} and reduced your loan by{' '}
            {impact.monthsSaved} months!
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Prepayment Calculator</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentType('lump_sum')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentType === 'lump_sum'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-gray-900">Lump Sum</p>
                    <p className="text-sm text-gray-600">One-time payment</p>
                  </button>
                  <button
                    onClick={() => setPaymentType('monthly')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      paymentType === 'monthly'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-gray-900">Monthly Extra</p>
                    <p className="text-sm text-gray-600">Recurring payment</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount: ₹{amount.toLocaleString('en-IN')}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>₹10K</span>
                  <span>₹5L</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Strategy</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStrategy('reduce_tenure')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      strategy === 'reduce_tenure'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-gray-900">Reduce Tenure</p>
                    <p className="text-sm text-gray-600">Get free faster</p>
                  </button>
                  <button
                    onClick={() => setStrategy('reduce_emi')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      strategy === 'reduce_emi'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold text-gray-900">Reduce EMI</p>
                    <p className="text-sm text-gray-600">Lower monthly burden</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-700">Interest Saved</p>
                </div>
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(impact.interestSaved)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-700">Time Saved</p>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  {Math.floor(impact.monthsSaved / 12)}y {impact.monthsSaved % 12}m
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <p className="text-sm text-purple-700">
                    {strategy === 'reduce_tenure' ? 'Same EMI' : 'New EMI'}
                  </p>
                </div>
                <p className="text-3xl font-bold text-purple-900">
                  {formatCurrency(impact.newEmi)}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>New Freedom Date:</strong>{' '}
                {addMonthsToDate(new Date(), impact.newTenure).toLocaleDateString('en-IN', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                That's {impact.monthsSaved} months earlier than your current plan!
              </p>
            </div>

            <button
              onClick={handlePrepayment}
              className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
            >
              Make Payment
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Plans</h3>
            <div className="space-y-4">
              {suggestedPlans.map((plan) => {
                const planImpact = calculatePrepaymentImpact(
                  activeLoan.currentBalance,
                  activeLoan.interestRate,
                  activeLoan.remainingMonths,
                  activeLoan.emiAmount,
                  plan.amount,
                  'reduce_tenure'
                );

                return (
                  <button
                    key={plan.amount}
                    onClick={() => setAmount(plan.amount)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      amount === plan.amount
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{plan.label}</p>
                      {plan.label === 'Recommended' && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          Best
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      ₹{plan.amount.toLocaleString('en-IN')}/mo
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>Saves: {formatCurrency(planImpact.interestSaved)}</p>
                      <p>
                        Time saved: {Math.floor(planImpact.monthsSaved / 12)}y{' '}
                        {planImpact.monthsSaved % 12}m
                      </p>
                      <p>Effort: {plan.effort}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-2">Pro Tip</h3>
            <p className="text-sm text-gray-700">
              Making extra payments in the early years has the maximum impact on interest savings.
              Even small amounts can save you lakhs!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
