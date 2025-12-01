import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "./TopNavbar";
import Footer from "./Footer";

export default function PageLayout() {
  const location = useLocation();

  // Map routes → page titles
  const titles: Record<string, string> = {
    "/": "Control",
    "/strats": "Strats",
    "/charts": "Charts",
    "/data": "Data",
    "/orders": "Orders",
    "/risk": "Risk",
    "/logs": "Logs",
    "/settings": "Settings"
  };

  const title = titles[location.pathname] ?? "qtrader";

  return (
    <div className="h-screen w-full flex bg-[#0f1419] text-white">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1">

        {/* Top navbar with dynamic title */}
        <TopNavbar title={title} />

        {/* Page content */}
        <main className="flex-1 overflow-auto px-8 py-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
}
