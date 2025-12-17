import { useState } from "react";
import {
  Home,
  Film,
  Calendar,
  Theater,
  Trophy,
  Activity,
  Tv,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface NavItem {
  id: string;
  name: string;
  icon: ReactNode;
  path: string;
  category?: string;
}

const navItems: NavItem[] = [
  { id: "home", name: "Home", icon: <Home size={24} />, path: "/" },
  { id: "movies", name: "Movies", icon: <Film size={24} />, path: "/", category: "movies" },
  { id: "events", name: "Events", icon: <Calendar size={24} />, path: "/", category: "events" },
  { id: "plays", name: "Plays", icon: <Theater size={24} />, path: "/", category: "plays" },
  { id: "sports", name: "Sports", icon: <Trophy size={24} />, path: "/", category: "sports" },
  { id: "activities", name: "Activities", icon: <Activity size={24} />, path: "/", category: "activities" },
  { id: "stream", name: "Stream", icon: <Tv size={24} />, path: "/", category: "stream" },
];

const VerticalSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const isActive = (item: NavItem) => item.id === "home" && location.pathname === "/";

  return (
    <>
      {/* Sidebar - hidden on mobile, shows on md+ */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed left-0 top-0 h-full bg-[#333338] text-white z-40 transition-all duration-300 ease-in-out hidden md:block ${
          isExpanded ? "w-60" : "w-[72px]"
        }`}
      >
        <div className="flex flex-col h-full py-4">
          {/* Logo area */}
          <div className="px-4 mb-8 h-16 flex items-center">
            {isExpanded ? (
              <h2 className="text-xl font-serif italic text-[#C9B194]">
                book<span className="text-[#F1F0E4]">&</span>watch
              </h2>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-[#8B5E3C] rounded-lg">
                <span className="text-white font-bold text-lg">B</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-4 py-3 transition-all duration-200 group ${
                  isActive(item)
                    ? "bg-[#8B5E3C] text-white border-l-4 border-[#C9B194]"
                    : "text-gray-300 hover:bg-[#404045] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="min-w-[24px] flex items-center justify-center">{item.icon}</div>
                  {isExpanded && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                      <ChevronRight
                        size={16}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </nav>

          {/* Profile / Footer area */}
          <div className="px-4 py-4 border-t border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#8B5E3C] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
              {isExpanded && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">User</p>
                  <p className="text-xs text-gray-400">View Profile</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer to prevent content overlap on md+ */}
      <div className="hidden md:block w-[72px]" />
    </>
  );
};

export default VerticalSidebar;
