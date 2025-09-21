import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage/HomePage.jsx';
import PrivacyPage from './pages/PrivacyPage/PrivacyPage.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';
import StructuredData from './components/StructuredData/StructuredData.jsx';
import './styles/main.scss';

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <StructuredData />
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* Catch-all route для 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;