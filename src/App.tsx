import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { TasksPage } from './pages/TasksPage';
import { CopilotPage } from './pages/CopilotPage';
import { ReallocationPage } from './pages/ReallocationPage';
import { SkillsPage } from './pages/SkillsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/copilot" element={<CopilotPage />} />
          <Route path="/reallocation" element={<ReallocationPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/forecasting" element={<ForecastingPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
