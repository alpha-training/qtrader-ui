import {
  SlidersHorizontal,
  Activity,
  BarChart2,
  Database,
  ClipboardList,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
//mport { useTheme } from "../../hooks/useTheme";
// import { Sun, Moon } from "lucide-react";
import logo from "../../assets/alpha-kdb-logo.png";

export default function Sidebar() {
  //const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-56 h-screen bg-[#0f1419] border-r border-gray-800 flex flex-col p-2">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <img src={logo} className="h-8 w-auto object-contain"loading="eager" alt="AlphaKDB logo" />
       {/*  <span className="text-xl font-semibold">qtrader</span> */}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">

        <SidebarItem label="Control" to="/" icon={<SlidersHorizontal size={20} />} />
        <SidebarItem label="Strats" to="/strats" icon={<Activity size={20} />} />
        <SidebarItem label="Charts" to="/charts" icon={<BarChart2 size={20} />} />
        <SidebarItem label="Data" to="/data" icon={<Database size={20} />} />
        <SidebarItem label="Orders" to="/orders" icon={<ClipboardList size={20} />} />
        <SidebarItem label="Risk" to="/risk" icon={<AlertTriangle size={20} />} />
        <SidebarItem label="Logs" to="/logs" icon={<FileText size={20} />} />
        <SidebarItem label="Settings" to="/settings" icon={<Settings size={20} />} />

      </nav>

      {/* Light Mode Toggle 
      <div className="mt-auto flex items-center gap-2 px-2 pt-6">
        {theme === "dark" ? (
          <Moon className="w-6 h-6 text-gray-300" />
        ) : (
          <Sun className="w-6 h-6 text-yellow-500" />
        )}

        <span className="text-sm font-medium text-gray-300">
          Light Mode
        </span>

        <button
          onClick={toggleTheme}
          className={`ml-auto relative w-12 h-6 rounded-full transition
            ${theme === "light" ? "bg-blue-500" : "bg-gray-600"}
          `}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition
              ${theme === "light" ? "translate-x-6" : ""}
            `}
          />
        </button>
      </div>
      */}
    </aside>
  );
}
