import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store";
import { Toaster } from "./components/ui/toaster";
import { Skeleton } from "./components/ui/skeleton";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <Toaster />
    <Skeleton />
  </Provider>
);
