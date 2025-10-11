import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Zap,
  Target,
  Trophy,
  Flame,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateProgressPercentage, formatCurrency, getDaysUntil } from '../utils/loanCalculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { MOCK_ACHIEVEMENTS } from '../utils/mockData';

export function Dashboard() {
  const { loans, payments, achievements, user } = useApp();
  const activeLoan = loans.find((l) => l.status === 'active');

  if (!activeLoan) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Loans</h2>
        <p className="text-gray-600 mb-6">Add your first loan to start your journey</p>
        <Link
          to="/onboarding"
          className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold"
        >
          Add Loan
        </Link>
      </div>
    );
  }

  const progress = calculateProgressPercentage(activeLoan);
  const daysToFreedom = activeLoan.goalEndDate
    ? getDaysUntil(activeLoan.goalEndDate)
    : getDaysUntil(activeLoan.projectedEndDate);

  const principalData = [
    { name: 'Paid', value: activeLoan.totalPrincipalPaid, color: '#4CAF50' },
    { name: 'Remaining', value: activeLoan.currentBalance, color: '#E0E0E0' },
  ];

  const interestData = [
    { name: 'Paid', value: activeLoan.totalInterestPaid, color: '#FF9800' },
    {
      name: 'Remaining',
      value: activeLoan.totalInterestOriginal - activeLoan.totalInterestPaid,
      color: '#E0E0E0',
    },
  ];

  const recentAchievements = achievements.slice(-3);
  const nextAchievement = MOCK_ACHIEVEMENTS.find(
    (a) => !achievements.some((ua) => ua.achievement.code === a.code)
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">You're {progress.toFixed(1)}% Debt-Free!</h1>
              <p className="text-green-100 text-lg">Keep going - you're doing amazing!</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-16 h-16" />
            </motion.div>
          </div>

          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-yellow-400 rounded-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm text-green-100">Freedom Day</span>
              </div>
              <p className="text-2xl font-bold">
                {activeLoan.projectedEndDate.toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-sm text-green-100">{daysToFreedom} days to go</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm text-green-100">Interest Saved</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(activeLoan.interestSaved)}</p>
              <p className="text-sm text-green-100">Through optimization</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm text-green-100">Months Accelerated</span>
              </div>
              <p className="text-2xl font-bold">{activeLoan.monthsAccelerated}</p>
              <p className="text-sm text-green-100">Faster than original plan</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">Principal Status</h3>
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={principalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                >
                  {principalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Paid</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(activeLoan.totalPrincipalPaid)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining</span>
              <span className="font-semibold">{formatCurrency(activeLoan.currentBalance)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">Interest Status</h3>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interestData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                >
                  {interestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Paid</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(activeLoan.totalInterestPaid)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining</span>
              <span className="font-semibold">
                {formatCurrency(activeLoan.totalInterestOriginal - activeLoan.totalInterestPaid)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-medium text-gray-700">Current Streak</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{user?.currentStreak || 0}</p>
          <p className="text-sm text-gray-600">months on-time</p>
          <div className="mt-4 pt-4 border-t border-orange-200">
            <p className="text-xs text-gray-600">
              Longest: <span className="font-semibold">{user?.longestStreak || 0} months</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-700">Your Level</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-1">{user?.level || 1}</p>
          <p className="text-sm text-gray-600">{user?.points || 0} points</p>
          <div className="mt-4">
            <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${((user?.points || 0) % 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {100 - ((user?.points || 0) % 100)} pts to level {(user?.level || 1) + 1}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/prepayment"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Make Extra Payment</p>
                  <p className="text-sm text-green-100">Save interest now</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/loan-intelligence"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5" />
                <div>
                  <p className="font-semibold">See Optimization Tips</p>
                  <p className="text-sm text-blue-100">Smart insights</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/refinance"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Check Refinancing</p>
                  <p className="text-sm text-purple-100">Better rates available</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
            <Link to="/achievements" className="text-sm text-green-600 hover:text-green-700">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentAchievements.map((ua) => (
              <motion.div
                key={ua.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{ua.achievement.name}</p>
                  <p className="text-sm text-gray-600">{ua.achievement.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    +{ua.achievement.points} pts
                  </p>
                </div>
              </motion.div>
            ))}

            {nextAchievement && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-60">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-700">{nextAchievement.name}</p>
                  <p className="text-sm text-gray-500">Locked - {nextAchievement.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
