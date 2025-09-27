// Import normalize CSS FIRST to establish base styles
import "normalize.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Import fonts to ensure they are included in build
import "./assets/fonts/fonts.js";

// Import SVG sprite system
import 'virtual:svg-icons-register';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
