import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Welcome } from './pages/Welcome';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { LoanIntelligence } from './pages/LoanIntelligence';
import { PrepaymentPlanner } from './pages/PrepaymentPlanner';
import { FreedomDate } from './pages/FreedomDate';
import { Achievements } from './pages/Achievements';
import { Alerts } from './pages/Alerts';
import { Refinance } from './pages/Refinance';
import { ChatBotContainer } from './components/ChatBotContainer';
import { getPrimaryLoanData } from './utils/loanDataConverter';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function AppRoutes() {
  const { isAuthenticated, loans } = useApp();
  const hasLoan = loans.length > 0;
  const loanData = getPrimaryLoanData(loans);

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Welcome />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                {hasLoan ? <Dashboard /> : <Navigate to="/onboarding" />}
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loan-intelligence"
          element={
            <ProtectedRoute>
              <Layout>
                <LoanIntelligence />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/prepayment"
          element={
            <ProtectedRoute>
              <Layout>
                <PrepaymentPlanner />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/freedom-date"
          element={
            <ProtectedRoute>
              <Layout>
                <FreedomDate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Layout>
                <Achievements />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Layout>
                <Alerts />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/refinance"
          element={
            <ProtectedRoute>
              <Layout>
                <Refinance />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      {isAuthenticated && <ChatBotContainer loanData={loanData} />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
