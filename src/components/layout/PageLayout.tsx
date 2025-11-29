import TopNavbar from "./TopNavbar";
import Footer from "./Footer";
import Sidebar from "../sidebar/Sidebar";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex bg-[#0f1419] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">

        {/* Top bar */}
        <TopNavbar />

        {/* Page content */}
        <main className="flex-1 overflow-auto px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>

    </div>
  );
}
