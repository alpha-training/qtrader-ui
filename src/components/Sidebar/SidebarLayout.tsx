import Sidebar from "./Sidebar";

type SidebarLayoutProps = {
  children: React.ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex bg-[#0c0f12] text-gray-200 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
