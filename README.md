# FinLiberate - Loan Repayment Optimization Platform

A comprehensive loan repayment optimization web application with gamified engagement and financial wellness features.

## Features

### Core Functionality
- **Loan Management**: Add and track multiple loans with detailed metrics
- **Smart Prepayment Planning**: Calculate impact of extra payments with visual comparisons
- **Loan Intelligence**: Interactive amortization schedules and what-if scenarios
- **Freedom Date Predictor**: Visual timeline showing journey to debt freedom
- **Refinancing Assistant**: Compare current rates with market offers
- **Achievement System**: Gamified milestones and rewards
- **Smart Alerts**: Personalized notifications and optimization tips

### Design Highlights
- Color Scheme: Soft greens (#81C784, #4CAF50), calming blues (#90CAF9, #64B5F6), yellow accents
- Typography: Inter font family for modern, friendly feel
- Mobile-first responsive design
- Smooth animations with Framer Motion
- Interactive charts with Recharts

## Getting Started

### Demo Mode
The app currently runs in demo mode using localStorage for data persistence. To get started:

1. Sign up with any email and password
2. Add your loan details (or use the defaults provided)
3. Explore all features:
   - Dashboard with progress tracking
   - Loan Intelligence with amortization breakdown
   - Prepayment Planner with impact calculator
   - Freedom Date timeline
   - Achievements wall
   - Refinancing comparison

### Demo Credentials
You can create any account - there's no backend validation in demo mode.

### Sample Data
The app includes:
- Pre-populated achievement badges
- Mock bank rate comparisons
- Sample alerts and notifications
- Realistic loan calculations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite

## Key Pages

1. **Dashboard**: Hero metrics, progress bars, quick actions, recent achievements
2. **Loan Intelligence**: EMI breakdown chart, amortization table, what-if simulator
3. **Prepayment Planner**: Interactive calculator with strategy comparison
4. **Freedom Date**: Timeline visualization with milestone tracking
5. **Achievements**: Badge wall with category-based organization
6. **Alerts**: Notification center with smart suggestions
7. **Refinancing**: Bank comparison and savings calculator

## Gamification Mechanics

- Points for every optimization action
- Badges for milestones (prepayment, streaks, savings, speed)
- Streak tracking for consistent payments
- Level progression system
- Achievement categories with unlock criteria
- Visual celebrations for wins

## Loan Calculations

The app performs accurate loan calculations including:
- EMI calculation using standard formula
- Amortization schedule generation
- Prepayment impact analysis (reduce tenure vs reduce EMI)
- Interest savings projections
- Timeline adjustments

## Future Enhancements

To make this production-ready:
1. Connect to Supabase for persistent storage
2. Implement real authentication
3. Add PDF loan statement parsing
4. Integrate with banking APIs
5. Add real-time interest rate feeds
6. Implement social features (community, leaderboards)
7. Add push notifications
8. Create mobile apps
9. Add insurance integration
10. Implement expense tracking for smart nudges

## Notes

- All data is stored in browser localStorage (demo mode)
- No actual financial transactions are processed
- Calculations are for illustrative purposes
- Interest rates and bank data are mock values

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

This is a demonstration project for educational purposes.
