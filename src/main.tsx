import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContextProvider } from "./components/AppContext";
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import "./styles/index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppContextProvider>
        <Router>
          <App />
        </Router>
      </AppContextProvider>
    </React.StrictMode>,
  );
}
