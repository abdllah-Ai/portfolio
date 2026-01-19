import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { UiProvider } from "./context/UiContext.jsx";
import { ContentProvider } from "./context/ContentContext.jsx";
import "./index.css";
import Admin from "./admin/Admin.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <UiProvider>
        <ContentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </ContentProvider>
      </UiProvider>
    </HelmetProvider>
  </React.StrictMode>
);
