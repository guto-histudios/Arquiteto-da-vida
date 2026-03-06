import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Habitos } from './pages/Habitos';
import { Metas } from './pages/Metas';
import { KPIs } from './pages/KPIs';
import { Analytics } from './pages/Analytics';
import { Configuracoes } from './pages/Configuracoes';
import { Onboarding } from './components/Onboarding';

function AppContent() {
  const { config, carregando } = useApp();

  if (carregando) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-text-main">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin"></div>
          <p className="text-text-sec animate-pulse">Carregando O Arquiteto...</p>
        </div>
      </div>
    );
  }

  if (!config.onboardingCompleted) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/habitos" element={<Habitos />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/kpis" element={<KPIs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

