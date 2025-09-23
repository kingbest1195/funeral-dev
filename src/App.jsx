import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import HomePage from './pages/HomePage/HomePage.jsx';
import StructuredData from './components/StructuredData/StructuredData.jsx';
import './styles/main.scss';

// Lazy imports для остальных страниц
const UslugiPage = React.lazy(() => import('./pages/UslugiPage/UslugiPage.jsx'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage/PrivacyPage.jsx'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage/NotFoundPage.jsx'));

// Компонент простой загрузки (без спиннера)
const PageFallback = () => <div style={{ minHeight: '100vh' }} />;

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
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/uslugi" element={<UslugiPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {/* Catch-all route для 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;