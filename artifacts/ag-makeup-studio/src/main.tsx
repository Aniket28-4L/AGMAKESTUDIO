import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Note: Bonus GSAP plugins like DrawSVGPlugin are not included in the standard gsap package.
// Fallback logic for stroke animations is implemented in Preloader.tsx using stroke-dashoffset.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
