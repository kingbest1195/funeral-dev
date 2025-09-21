import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Import normalize CSS
import "normalize.css";

// Import fonts to ensure they are included in build
import "./assets/fonts/fonts.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
