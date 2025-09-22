import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import HomePage from './pages/HomePage/HomePage.jsx';
import PrivacyPage from './pages/PrivacyPage/PrivacyPage.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';
import StructuredData from './components/StructuredData/StructuredData.jsx';
import './styles/main.scss';

// Компонент для автоматического скролла наверх при смене маршрута
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
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