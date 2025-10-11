import { useState } from 'react';
import { Target, Calendar, TrendingUp, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  formatCurrency,
  addMonthsToDate,
  calculateExtraMonthlyPaymentImpact,
  getDaysUntil,
} from '../utils/loanCalculations';
import { motion } from 'framer-motion';

export function FreedomDate() {
  const { loans } = useApp();
  const activeLoan = loans.find((l) => l.status === 'active');
  const [extraMonthly, setExtraMonthly] = useState(0);

  if (!activeLoan) {
    return <div className="text-center py-12 text-gray-600">No active loan found</div>;
  }

  const impact = extraMonthly > 0
    ? calculateExtraMonthlyPaymentImpact(
        activeLoan.currentBalance,
        activeLoan.interestRate,
        activeLoan.remainingMonths,
        activeLoan.emiAmount,
        extraMonthly
      )
    : { monthsSaved: 0, interestSaved: 0, newTenure: activeLoan.remainingMonths };

  const currentEndDate = addMonthsToDate(new Date(), activeLoan.remainingMonths);
  const optimizedEndDate = addMonthsToDate(new Date(), impact.newTenure);
  const goalDate = activeLoan.goalEndDate || currentEndDate;

  const progress = ((activeLoan.totalPrincipalPaid / activeLoan.originalAmount) * 100).toFixed(1);

  const milestones = [
    { percent: 25, label: '25% Complete', achieved: parseFloat(progress) >= 25 },
    { percent: 50, label: 'Halfway There', achieved: parseFloat(progress) >= 50 },
    { percent: 75, label: '75% Complete', achieved: parseFloat(progress) >= 75 },
    { percent: 90, label: 'Almost Free', achieved: parseFloat(progress) >= 90 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan-Free Date Predictor</h1>
        <p className="text-gray-600">Track your journey to financial freedom</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-2xl p-8 text-white"
      >
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Calendar className="w-12 h-12 mx-auto mb-2" />
          </div>
          <h2 className="text-4xl font-bold">
            {optimizedEndDate.toLocaleDateString('en-IN', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </h2>
          <p className="text-xl text-green-100">Your Projected Freedom Date</p>
          <p className="text-lg">
            {getDaysUntil(optimizedEndDate)} days to go • {Math.floor(impact.newTenure / 12)} years{' '}
            {impact.newTenure % 12} months
          </p>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Adjust Your Timeline</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add ₹{extraMonthly.toLocaleString('en-IN')} extra per month
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>₹0</span>
              <span>₹50,000</span>
            </div>
          </div>

          {extraMonthly > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <Zap className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-sm text-green-700">Time Saved</p>
                <p className="text-2xl font-bold text-green-900">
                  {Math.floor(impact.monthsSaved / 12)}y {impact.monthsSaved % 12}m
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-sm text-blue-700">Interest Saved</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(impact.interestSaved)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-sm text-purple-700">New End Date</p>
                <p className="text-lg font-bold text-purple-900">
                  {optimizedEndDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Timeline</h2>
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200" />
            {[
              {
                label: 'Loan Started',
                date: activeLoan.startDate,
                color: 'bg-gray-500',
                done: true,
              },
              {
                label: 'Current Position',
                date: new Date(),
                color: 'bg-blue-500',
                done: false,
                current: true,
              },
              {
                label: 'Original End Date',
                date: activeLoan.originalEndDate,
                color: 'bg-orange-500',
                done: false,
              },
              {
                label: 'Projected End Date',
                date: optimizedEndDate,
                color: 'bg-green-500',
                done: false,
              },
            ].map((item, index) => (
              <div key={index} className="relative flex items-start space-x-4 mb-8">
                <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center z-10`}>
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{item.label}</h3>
                    {item.current && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        You are here
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('en-IN', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Milestones</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.percent}
              className={`p-6 rounded-xl text-center ${
                milestone.achieved
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300'
                  : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  milestone.achieved ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
              >
                <span className="text-xl font-bold text-white">{milestone.percent}%</span>
              </div>
              <p className="font-semibold text-gray-900">{milestone.label}</p>
              {milestone.achieved && (
                <p className="text-xs text-green-600 mt-1">Achieved!</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Narrative</h3>
        <div className="space-y-2 text-gray-700">
          <p>
            You started owing <strong>{formatCurrency(activeLoan.originalAmount)}</strong>. Now you
            owe <strong>{formatCurrency(activeLoan.currentBalance)}</strong>. That's{' '}
            <strong className="text-green-600">{formatCurrency(activeLoan.totalPrincipalPaid)}</strong>{' '}
            of freedom!
          </p>
          <p>
            At this pace, you'll be debt-free by{' '}
            <strong>{currentEndDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>
            {activeLoan.monthsAccelerated > 0 &&
              ` - ${activeLoan.monthsAccelerated} months earlier than planned`}
            .
          </p>
          <p>
            Next milestone:{' '}
            <strong>
              {milestones.find((m) => !m.achieved)?.label || 'Debt-Free!'} (only{' '}
              {formatCurrency(
                (((milestones.find((m) => !m.achieved)?.percent || 100) / 100) *
                  activeLoan.originalAmount) -
                  activeLoan.totalPrincipalPaid
              )}{' '}
              to go!)
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
