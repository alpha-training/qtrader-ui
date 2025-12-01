import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

type SidebarItemProps = {
  label: string;
  to: string;
  icon: ReactNode;
};

export default function SidebarItem({ label, to, icon }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition
        ${isActive ? "bg-blue-600 text-white" : "text-gray-300  hover:bg-gray-700 hover:text-white"}`
      }
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}
