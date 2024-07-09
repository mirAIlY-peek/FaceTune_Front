import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import { SpeedInsights } from '@vercel/speed-insights/react'


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
        <SpeedInsights />
    </Router>
  </React.StrictMode>
);
