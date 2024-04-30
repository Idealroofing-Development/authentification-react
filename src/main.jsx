import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppProviders } from "./context/index.jsx";
import { Profiler } from "./utils/Profiler.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Profiler id="App Root" phases={["mount"]}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>
  </React.StrictMode>
);
