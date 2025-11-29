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

export default function Sidebar() {
  return (
    <aside className="w-56 h-screen bg-[#0f1419] border-r border-gray-800 flex flex-col p-4">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <img src="/vite.svg" className="w-8 h-8" />
        <span className="text-xl font-semibold">qtrader</span>
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
    </aside>
  );
}
