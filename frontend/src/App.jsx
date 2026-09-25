import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NaukriFormPage from './pages/NaukriFormPage';
import LinkedinFormPage from './pages/LinkedinFormPage';
import ResultsPage from './pages/ResultsPage';
import RunResultsPage from './pages/RunResultsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/scrape/naukri" element={<NaukriFormPage />} />
        <Route path="/scrape/linkedin" element={<LinkedinFormPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/results/:runId" element={<RunResultsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
