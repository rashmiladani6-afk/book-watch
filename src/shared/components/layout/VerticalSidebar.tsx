import {
  Home,
  Film,
  Calendar,
  Theater,
  Trophy,
  Activity,
  Tv,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";

interface NavItem {
  id: string;
  name: string;
  icon: ReactNode;
  path: string;
  category?: string;
}

const navItems: NavItem[] = [
  { id: "home", name: "Home", icon: <Home size={18} />, path: "/" },
  { id: "movies", name: "Movies", icon: <Film size={18} />, path: "/", category: "movies" },
  { id: "events", name: "Events", icon: <Calendar size={18} />, path: "/", category: "events" },
  { id: "plays", name: "Plays", icon: <Theater size={18} />, path: "/", category: "plays" },
  { id: "sports", name: "Sports", icon: <Trophy size={18} />, path: "/", category: "sports" },
  { id: "activities", name: "Activities", icon: <Activity size={18} />, path: "/", category: "activities" },
  { id: "stream", name: "Stream", icon: <Tv size={18} />, path: "/", category: "stream" },
];

const VerticalSidebar = () => {
  const location = useLocation();

  // Basic matching logic
  const isActive = (item: NavItem) => {
    if (item.id === "home" && location.pathname === "/") return true;
    // Add more logic if needed for other routes
    return false;
  };

  return (
    <>
      {/* MOBILE HEADER & NAVIGATION */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4 justify-between shadow-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2 text-gray-700">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-white">
            <div className="flex flex-col h-full py-6">
              {/* Mobile Logo */}
              <div className="px-6 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#8B5E3C] rounded-lg shadow-sm">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-lg font-bold text-gray-800 tracking-tight">book&watch</span>
              </div>

              {/* Mobile Nav Items - List View */}
              <nav className="flex-1 overflow-y-auto px-4 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${active
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <div className={`${active ? "text-blue-600" : "text-gray-500"}`}>
                        {item.icon}
                      </div>
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Profile */}
              <div className="mt-auto px-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#8B5E3C] rounded-full shadow-sm">
                    <span className="text-white font-semibold text-sm">U</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">User Profile</p>
                    <p className="text-xs text-gray-500">View Account</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Centered Logo for Mobile Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-[#8B5E3C] rounded-md shadow-sm">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-bold text-gray-700">book&watch</span>
        </div>

        {/* Placeholder for balance */}
        <div className="w-8" />
      </div>

      {/* Mobile Header Spacer */}
      <div className="md:hidden h-16" />


      {/* DESKTOP SIDEBAR - hidden on mobile, shows on md+ */}
      {/* Width set to w-[90px] (approx 90px) to accommodate text comfortably */}
      <aside className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 hidden md:flex flex-col w-[90px] shadow-sm">

        {/* Logo Section */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-[#8B5E3C] rounded-lg mb-2 shadow-sm">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="text-[11px] font-medium text-gray-600 leading-tight">book&watch</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto w-full mt-2 scrollbar-hide">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex flex-col items-center justify-center w-full py-4 transition-colors duration-200 ${active
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {/* Active Border Indicator (Left) */}
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md" />
                )}

                {/* Icon */}
                <div className={`mb-1.5 ${active ? "text-blue-600" : "text-gray-500"}`}>
                  {item.icon}
                </div>

                {/* Label */}
                <span className="text-[11px] font-medium tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="py-6 border-t border-gray-100 w-full flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 flex items-center justify-center bg-[#8B5E3C] rounded-full mb-1.5 shadow-sm">
            <span className="text-white font-semibold text-sm">U</span>
          </div>
          <span className="text-[11px] font-medium text-gray-600">Profile</span>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className="hidden md:block w-[90px]" />
    </>
  );
};

export default VerticalSidebar;