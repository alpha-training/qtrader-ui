export default function TopNavbar() {
    return (
      <header className="w-full h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0f1419]">
        
        {/* Left empty space or breadcrumbs */}
        <div></div>
  
        {/* Right actions */}
        <div className="flex items-center gap-8 text-gray-300">
          <span className="cursor-pointer hover:text-white">Workspace</span>
          <span className="cursor-pointer hover:text-white">ENV</span>
          <span className="text-gray-400">⌘K</span>
        </div>
  
      </header>
    );
  }
  