import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Code2, Laptop, Folder, FolderKanban, Boxes } from "lucide-react";

type TopNavbarProps = {
  title?: string;
};

export default function TopNavbar({ title }: TopNavbarProps) {
  // Workspace menu
  const [workspace, setWorkspace] = useState("Default");
  const [wsOpen, setWsOpen] = useState(false);
  const wsRef = useRef<HTMLDivElement>(null);

  const workspaceOptions = [
    { label: "Default", icon: <Folder size={14} className="text-gray-300" /> },
    { label: "Trading", icon: <FolderKanban size={14} className="text-blue-400" /> },
    { label: "Analytics", icon: <Boxes size={14} className="text-purple-400" /> },
  ];

  // ENV menu
  const [env, setEnv] = useState("Prod");
  const [envOpen, setEnvOpen] = useState(false);
  const envRef = useRef<HTMLDivElement>(null);

  const envOptions = [
    { label: "Prod", icon: <ShieldCheck size={14} className="text-green-400" /> },
    { label: "Dev", icon: <Code2 size={14} className="text-blue-400" /> },
    { label: "Local", icon: <Laptop size={14} className="text-gray-300" /> },
  ];

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setWsOpen(false);
      if (envRef.current && !envRef.current.contains(e.target as Node)) setEnvOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="h-14 border-b border-gray-800 bg-[#0d1116] flex items-center justify-between px-8">
      
      {/* LEFT: Page Title */}
      <div className="text-xl font-semibold text-white">
        {title}
      </div>

      {/* RIGHT: Workspace + ENV + Shortcut */}
      <div className="flex items-center gap-8 text-gray-300">

        {/* WORKSPACE DROPDOWN */}
        <div className="relative" ref={wsRef}>
          <button
            onClick={() => setWsOpen(!wsOpen)}
            className="
              flex items-center gap-2 px-3 py-1
              border border-gray-700 rounded-md text-sm
              bg-transparent hover:border-gray-500 transition
            "
          >
            <span>
              {workspace === "Default" && <Folder size={14} className="text-gray-300" />}
              {workspace === "Trading" && <FolderKanban size={14} className="text-blue-400" />}
              {workspace === "Analytics" && <Boxes size={14} className="text-purple-400" />}
            </span>

            {workspace}

            <span
              className={`
                text-gray-500 transition-transform duration-200
                ${wsOpen ? "rotate-180" : "rotate-0"}
              `}
            >
              ▾
            </span>
          </button>

          {/* WORKSPACE MENU */}
          <div
            className={`
              absolute right-0 mt-2 w-40 z-20
              bg-[#0f1419] border border-gray-700 rounded-md shadow-lg
              overflow-hidden
              transition-all duration-200 ease-out origin-top
              ${wsOpen
                ? "opacity-100 translate-y-0 scale-y-100"
                : "opacity-0 translate-y-[-6px] scale-y-75 pointer-events-none"
              }
            `}
          >
            {workspaceOptions.map((opt) => (
              <div
                key={opt.label}
                onClick={() => {
                  setWorkspace(opt.label);
                  setWsOpen(false);
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 cursor-pointer
                  hover:bg-gray-700 hover:text-white transition
                  ${opt.label === workspace ? "text-white" : "text-gray-300"}
                `}
              >
                {opt.icon}
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        {/* ENV DROPDOWN */}
        <div className="relative" ref={envRef}>
          <button
            onClick={() => setEnvOpen(!envOpen)}
            className="
              flex items-center gap-2 px-3 py-1
              border border-gray-700 rounded-md text-sm
              bg-transparent hover:border-gray-500 transition
            "
          >
            <span>
              {env === "Prod" && <ShieldCheck size={14} className="text-green-400" />}
              {env === "Dev" && <Code2 size={14} className="text-blue-400" />}
              {env === "Local" && <Laptop size={14} className="text-gray-300" />}
            </span>

            {env}

            <span
              className={`
                text-gray-500 transition-transform duration-200
                ${envOpen ? "rotate-180" : "rotate-0"}
              `}
            >
              ▾
            </span>
          </button>

          {/* ENV MENU */}
          <div
            className={`
              absolute right-0 mt-2 w-32 z-20
              bg-[#0f1419] border border-gray-700 rounded-md shadow-lg
              overflow-hidden
              transition-all duration-200 ease-out origin-top
              ${envOpen
                ? "opacity-100 translate-y-0 scale-y-100"
                : "opacity-0 translate-y-[-6px] scale-y-75 pointer-events-none"
              }
            `}
          >
            {envOptions.map((opt) => (
              <div
                key={opt.label}
                onClick={() => {
                  setEnv(opt.label);
                  setEnvOpen(false);
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 cursor-pointer
                  hover:bg-gray-700 hover:text-white transition
                  ${opt.label === env ? "text-white" : "text-gray-300"}
                `}
              >
                {opt.icon}
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        {/* CMD + K Shortcut */}
        <span className="text-gray-500 border border-gray-700 px-2 py-1 rounded-md text-xs">
          ⌘K
        </span>
      </div>
    </div>
  );
}
