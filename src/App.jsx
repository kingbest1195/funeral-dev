import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage/HomePage.jsx';
import StructuredData from './components/StructuredData/StructuredData.jsx';
import './styles/main.scss';

const App = () => {
  return (
    <HelmetProvider>
      <StructuredData />
      <div className="app">
        <HomePage />
      </div>
    </HelmetProvider>
  );
};

export default App;