import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./css/style.css";
import "./css/satoshi.css";
import { Provider } from "react-redux";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </Provider>
  </React.StrictMode>
);
