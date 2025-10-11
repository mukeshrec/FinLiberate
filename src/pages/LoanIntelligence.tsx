import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  generateAmortizationSchedule,
  calculateExtraMonthlyPaymentImpact,
  formatCurrency,
} from '../utils/loanCalculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calculator, AlertCircle } from 'lucide-react';

export function LoanIntelligence() {
  const { loans } = useApp();
  const activeLoan = loans.find((l) => l.status === 'active');
  const [extraMonthly, setExtraMonthly] = useState(5000);

  if (!activeLoan) {
    return <div className="text-center py-12 text-gray-600">No active loan found</div>;
  }

  const schedule = generateAmortizationSchedule(
    activeLoan.originalAmount,
    activeLoan.interestRate,
    activeLoan.tenureMonths
  );

  const yearlyData = schedule.reduce((acc: any[], entry) => {
    const existing = acc.find((item) => item.year === entry.year);
    if (existing) {
      existing.principal += entry.principal;
      existing.interest += entry.interest;
    } else {
      acc.push({
        year: entry.year,
        principal: entry.principal,
        interest: entry.interest,
      });
    }
    return acc;
  }, []);

  const impact = calculateExtraMonthlyPaymentImpact(
    activeLoan.currentBalance,
    activeLoan.interestRate,
    activeLoan.remainingMonths,
    activeLoan.emiAmount,
    extraMonthly
  );

  const currentMonthIndex = activeLoan.tenureMonths - activeLoan.remainingMonths;
  const currentYearIndex = Math.floor(currentMonthIndex / 12);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Intelligence</h1>
        <p className="text-gray-600">Understand where your money goes</p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-start space-x-4">
          <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Shocking Truth</h3>
            <p className="text-gray-700">
              Out of <span className="font-bold">{formatCurrency(activeLoan.totalPrincipalPaid + activeLoan.totalInterestPaid)}</span> paid so far,
              only <span className="font-bold text-green-600">{formatCurrency(activeLoan.totalPrincipalPaid)}</span> reduced your loan.
              That's just <span className="font-bold">{Math.round((activeLoan.totalPrincipalPaid / (activeLoan.totalPrincipalPaid + activeLoan.totalInterestPaid)) * 100)}%</span>!
            </p>
            <p className="text-gray-700 mt-2">
              The rest <span className="font-bold text-orange-600">{formatCurrency(activeLoan.totalInterestPaid)}</span> went to interest.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">EMI Breakdown Over Time</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="principal"
                stroke="#4CAF50"
                strokeWidth={3}
                name="Principal"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="interest"
                stroke="#FF9800"
                strokeWidth={3}
                name="Interest"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Notice how interest dominates early payments. Extra payments now have maximum impact!
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calculator className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">What-If Simulator</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add ₹{extraMonthly.toLocaleString('en-IN')} extra per month
            </label>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={extraMonthly}
              onChange={(e) => setExtraMonthly(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>₹1,000</span>
              <span>₹50,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <p className="text-sm text-green-700 mb-1">Interest Saved</p>
              <p className="text-3xl font-bold text-green-900">{formatCurrency(impact.interestSaved)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
              <p className="text-sm text-blue-700 mb-1">Time Saved</p>
              <p className="text-3xl font-bold text-blue-900">
                {Math.floor(impact.monthsSaved / 12)}y {impact.monthsSaved % 12}m
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
              <p className="text-sm text-purple-700 mb-1">New Tenure</p>
              <p className="text-3xl font-bold text-purple-900">
                {Math.floor(impact.newTenure / 12)}y {impact.newTenure % 12}m
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div>
              <p className="font-semibold text-gray-900">Original Plan</p>
              <p className="text-sm text-gray-600">
                {activeLoan.remainingMonths} months • {formatCurrency(activeLoan.emiAmount)}/month
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-900">Optimized Plan</p>
              <p className="text-sm text-green-700">
                {impact.newTenure} months • {formatCurrency(activeLoan.emiAmount + extraMonthly)}/month
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Amortization Table</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Year</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Paid</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Principal</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Interest</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Balance</th>
            </tr>
          </thead>
          <tbody>
            {yearlyData.map((row, index) => (
              <tr
                key={row.year}
                className={`border-b border-gray-200 ${
                  index === currentYearIndex ? 'bg-green-50' : ''
                }`}
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  Year {row.year}
                  {index === currentYearIndex && (
                    <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </td>
                <td className="text-right py-3 px-4 text-sm text-gray-900">
                  {formatCurrency(row.principal + row.interest)}
                </td>
                <td className="text-right py-3 px-4 text-sm text-green-600 font-medium">
                  {formatCurrency(row.principal)}
                </td>
                <td className="text-right py-3 px-4 text-sm text-orange-600 font-medium">
                  {formatCurrency(row.interest)}
                </td>
                <td className="text-right py-3 px-4 text-sm text-gray-900">
                  {formatCurrency(
                    activeLoan.originalAmount -
                      schedule
                        .filter((s) => s.year <= row.year)
                        .reduce((sum, s) => sum + s.principal, 0)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
