import { NavLink } from "react-router-dom";

type SidebarItemProps = {
  label: string;
  to: string;
  icon?: React.ReactNode;
};

export default function SidebarItem({ label, to, icon }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-2 rounded-md 
        text-white hover:bg-gray-800 transition-colors 
        ${isActive ? "bg-blue-600 text-white font-regular" : ""}
        `
      }
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span>{label}</span>
    </NavLink>
  );
}
