import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Calculator, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Loan } from '../types';
import {
  calculateEMI,
  calculateTotalInterest,
  addMonthsToDate,
  calculateMonthsBetweenDates,
} from '../utils/loanCalculations';
import { generateMockAlerts } from '../utils/mockData';
import { storage } from '../utils/storage';

export function Onboarding() {
  const navigate = useNavigate();
  const { user, addLoan } = useApp();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    loanName: 'Home Loan',
    originalAmount: 4000000,
    interestRate: 9.0,
    tenureMonths: 240,
    startDate: '2020-01-01',
    bankName: 'HDFC Bank',
    goalMonths: 180,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'loanName' || name === 'bankName' ? value : parseFloat(value) || value,
    }));
  };

  const handleSubmit = () => {
    if (!user) return;

    const emiAmount = calculateEMI(
      formData.originalAmount,
      formData.interestRate,
      formData.tenureMonths
    );

    const totalInterestOriginal = calculateTotalInterest(
      formData.originalAmount,
      formData.interestRate,
      formData.tenureMonths
    );

    const startDate = new Date(formData.startDate);
    const originalEndDate = addMonthsToDate(startDate, formData.tenureMonths);
    const monthsElapsed = calculateMonthsBetweenDates(startDate, new Date());
    const remainingMonths = Math.max(formData.tenureMonths - monthsElapsed, 1);

    const currentBalance = formData.originalAmount * 0.7;
    const totalPrincipalPaid = formData.originalAmount - currentBalance;
    const totalInterestPaid = totalInterestOriginal * 0.3;

    const goalEndDate = formData.goalMonths
      ? addMonthsToDate(new Date(), formData.goalMonths)
      : originalEndDate;

    const loan: Loan = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      loanName: formData.loanName,
      originalAmount: formData.originalAmount,
      currentBalance,
      interestRate: formData.interestRate,
      tenureMonths: formData.tenureMonths,
      remainingMonths,
      emiAmount,
      startDate,
      originalEndDate,
      projectedEndDate: addMonthsToDate(new Date(), remainingMonths),
      goalEndDate,
      totalInterestOriginal,
      totalInterestPaid,
      totalPrincipalPaid,
      interestSaved: 0,
      monthsAccelerated: 0,
      status: 'active',
      bankName: formData.bankName,
    };

    addLoan(loan);

    const alerts = generateMockAlerts(user.id, loan.id);
    alerts.forEach(alert => storage.addAlert(alert));

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                {step === 1 && <Upload className="w-8 h-8 text-white" />}
                {step === 2 && <Calculator className="w-8 h-8 text-white" />}
                {step === 3 && <Target className="w-8 h-8 text-white" />}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 1 && 'Add Your Loan Details'}
              {step === 2 && 'Calculate Your EMI'}
              {step === 3 && 'Set Your Freedom Goal'}
            </h2>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-16 rounded-full ${
                    s <= step ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> We'll use sample data to show you how FinLiberate works.
                  Enter your loan details below or use the default values.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Type
                  </label>
                  <select
                    name="loanName"
                    value={formData.loanName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option>Home Loan</option>
                    <option>Car Loan</option>
                    <option>Personal Loan</option>
                    <option>Education Loan</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="originalAmount"
                    value={formData.originalAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenure (Months)
                  </label>
                  <input
                    type="number"
                    name="tenureMonths"
                    value={formData.tenureMonths}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly EMI</span>
                  <span className="text-3xl font-bold text-gray-900">
                    ₹
                    {Math.round(
                      calculateEMI(
                        formData.originalAmount,
                        formData.interestRate,
                        formData.tenureMonths
                      )
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="text-xl font-semibold text-orange-600">
                    ₹
                    {Math.round(
                      calculateTotalInterest(
                        formData.originalAmount,
                        formData.interestRate,
                        formData.tenureMonths
                      )
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Payment</span>
                  <span className="text-xl font-semibold text-gray-700">
                    ₹
                    {Math.round(
                      formData.originalAmount +
                        calculateTotalInterest(
                          formData.originalAmount,
                          formData.interestRate,
                          formData.tenureMonths
                        )
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Did you know?</strong> You'll pay{' '}
                  <strong>
                    {Math.round(
                      (calculateTotalInterest(
                        formData.originalAmount,
                        formData.interestRate,
                        formData.tenureMonths
                      ) /
                        formData.originalAmount) *
                        100
                    )}
                    %
                  </strong>{' '}
                  of your loan amount in interest alone! But we can help you reduce that significantly.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  When do you want to be debt-free?
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { months: 120, label: '10 Years' },
                    { months: 180, label: '15 Years' },
                    { months: 240, label: '20 Years' },
                  ].map((option) => (
                    <button
                      key={option.months}
                      onClick={() => setFormData({ ...formData, goalMonths: option.months })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.goalMonths === option.months
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <div className="text-2xl font-bold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.months} months</div>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or set custom months
                  </label>
                  <input
                    type="number"
                    name="goalMonths"
                    value={formData.goalMonths}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl text-white">
                <div className="text-center space-y-2">
                  <p className="text-green-100">Your Freedom Date</p>
                  <p className="text-4xl font-bold">
                    {addMonthsToDate(new Date(), formData.goalMonths).toLocaleDateString('en-IN', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-green-100">
                    That's {Math.floor(formData.goalMonths / 12)} years and{' '}
                    {formData.goalMonths % 12} months from now!
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                >
                  Start Your Journey
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
