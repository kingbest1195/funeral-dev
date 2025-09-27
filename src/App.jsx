import React, { Suspense } from 'react';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import HomePage from './pages/HomePage/HomePage.jsx';
import StructuredData from './components/StructuredData/StructuredData.jsx';
import { getCurrentPageType } from './utils/pageDetection.js';
import './styles/main.scss';

// Lazy imports для остальных страниц
const UslugiPage = React.lazy(() => import('./pages/UslugiPage/UslugiPage.jsx'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage/PrivacyPage.jsx'));
const OrganizatsiyaPohoronPage = React.lazy(() => import('./pages/OrganizatsiyaPohoronPage/OrganizatsiyaPohoronPage.jsx'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage/NotFoundPage.jsx'));

/**
 * Компонент простой загрузки (без спиннера)
 * Сохраняет минимальную высоту для предотвращения layout shift
 */
const PageFallback = () => <div style={{ minHeight: '100vh' }} />;

/**
 * Основной компонент приложения для MPA архитектуры
 * Определяет текущую страницу по data-page атрибуту и рендерит соответствующий компонент
 */
const App = () => {
  // Определяем тип текущей страницы
  const currentPageType = getCurrentPageType();

  // Рендерим соответствующую страницу
  const renderCurrentPage = () => {
    switch (currentPageType) {
      case 'home':
        return <HomePage />;
      case 'uslugi':
        return (
          <Suspense fallback={<PageFallback />}>
            <UslugiPage />
          </Suspense>
        );
      case 'privacy':
        return (
          <Suspense fallback={<PageFallback />}>
            <PrivacyPage />
          </Suspense>
        );
      case 'organizatsiya-pohoron':
        return (
          <Suspense fallback={<PageFallback />}>
            <OrganizatsiyaPohoronPage />
          </Suspense>
        );
      default:
        // Fallback для неизвестных страниц
        return (
          <Suspense fallback={<PageFallback />}>
            <NotFoundPage />
          </Suspense>
        );
    }
  };

  return (
    <HelmetProvider>
      <StructuredData />
      <div className="app">
        {renderCurrentPage()}
      </div>
    </HelmetProvider>
  );
};

export default App;