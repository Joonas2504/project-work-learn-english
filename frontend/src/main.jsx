import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * Root rendering function for the React application
 * @function
 * @name renderRoot
 * @param {HTMLElement} rootElement - The root element where the React application will be rendered.
 * @returns {void}
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
