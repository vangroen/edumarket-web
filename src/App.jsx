import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import CatalogsPage from './pages/CatalogsPage';
import StudentsPage from './pages/StudentsPage';
import AgentsPage from './pages/AgentsPage';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <CoursesPage />;
      case 'catalogs':
        return <CatalogsPage />;
      case 'agents':
        return <AgentsPage />;  
      case 'students':
        return <StudentsPage />;
      default:
        return (
          <div className="text-center p-10 bg-dark-surface rounded-lg">
            <h1 className="text-2xl font-semibold text-dark-text-primary">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>
            <p className="text-dark-text-secondary mt-2">
              Funcionalidad para esta sección no implementada.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text-primary font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;