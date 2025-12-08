import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PageLayout from "./components/layout/PageLayout";
import ControlPage from "./pages/ControlPage";
import StratsPage from "./pages/StratsPage";
import ChartsPage from "./pages/ChartsPage";
import DataPage from "./pages/DataPage";
import OrdersPage from "./pages/OrdersPage";
import RiskPage from "./pages/RiskPage";
import LogsPage from "./pages/LogsPage";
import SettingsPage from "./pages/SettingsPage";

import { wsClient } from "./ws";
import WsBanner from "./components/UI/WsBanner";
import Toasts from "./components/UI/Toasts";

function App() {
  useEffect(() => {
    console.log("[APP] Initializing WS client");
    wsClient.connect();
  }, []);

  return (
    <>
      <Toasts />
      <WsBanner />

      <BrowserRouter>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<ControlPage />} />
            <Route path="/strats" element={<StratsPage />} />
            <Route path="/charts" element={<ChartsPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
