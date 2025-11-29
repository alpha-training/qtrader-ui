import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import TopNavbar from "./TopNavbar";
import Footer from "./Footer";

export default function PageLayout() {
  return (
    <div className="h-screen w-full flex bg-[#0f1419] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1">

        {/* Top navbar */}
        <TopNavbar />

        {/* Page content */}
        <main className="flex-1 overflow-auto px-8 py-6">
          <Outlet />   {/* <-- PAGE CONTENT GOES HERE */}
        </main>

        {/* Footer */}
        <Footer />
      </div>

    </div>
  );
}
