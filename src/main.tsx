import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ConfigProvider } from "./context/ConfigContext.tsx";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);
