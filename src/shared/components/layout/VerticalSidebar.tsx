import {
  Home,
  Calendar,
  Ticket,
  MapPin,
  Music,
  Trophy,
  Menu,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { SIDEBAR_WIDTH_PX } from "@/shared/constants/layout";
import { brand } from "@/shared/constants/theme";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import AppLogo from "@/shared/components/common/AppLogo";

interface NavItem {
  id: string;
  name: string;
  icon: ReactNode;
  path: string;
  requiresAuth?: boolean;
  navSection?: string;
}

const NAV_QUERY_KEY = "nav";

const navItems: NavItem[] = [
  { id: "home", name: "Home", icon: <Home size={22} strokeWidth={1.75} />, path: ROUTES.HOME },
  {
    id: "events",
    name: "Events",
    icon: <Calendar size={22} strokeWidth={1.75} />,
    path: ROUTES.EVENTS_LIST,
    navSection: "events",
  },
  {
    id: "pass",
    name: "Pass",
    icon: <Ticket size={22} strokeWidth={1.75} />,
    path: ROUTES.PASSES,
  },
  {
    id: "venues",
    name: "Venues",
    icon: <MapPin size={22} strokeWidth={1.75} />,
    path: ROUTES.VENUES,
  },
  {
    id: "singers",
    name: "Singers",
    icon: <Music size={22} strokeWidth={1.75} />,
    path: ROUTES.SINGERS,
  },
  {
    id: "vip",
    name: "VIP",
    icon: <Trophy size={22} strokeWidth={1.75} />,
    path: ROUTES.VIP,
  },
];

const SidebarBrand = ({ compact = false }: { compact?: boolean }) => (
  <AppLogo
    compact={compact}
    className="bg-transparent"
    imageClassName={compact ? "h-11 w-[4.75rem]" : "h-14 w-[5.5rem]"}
  />
);

const isEventsPath = (pathname: string) =>
  pathname === ROUTES.EVENTS ||
  pathname === ROUTES.EVENTS_LIST ||
  (pathname.startsWith("/events/") && pathname !== ROUTES.FAVORITE_EVENTS);

const VerticalSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const profileInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const openProfile = () => {
    if (authLoading) return;
    if (user) {
      navigate(ROUTES.PROFILE);
      return;
    }
    navigate(getAuthUrl(ROUTES.PROFILE));
  };

  const isActive = (item: NavItem) => {
    const { pathname, search } = location;
    const navSection = new URLSearchParams(search).get(NAV_QUERY_KEY);

    switch (item.id) {
      case "home":
        return pathname === ROUTES.HOME;
      case "pass":
        return pathname === ROUTES.PASSES;
      case "events": {
        if (!isEventsPath(pathname)) return false;
        if (pathname === ROUTES.EVENTS_LIST || pathname === ROUTES.EVENTS) {
          return !navSection || navSection === "events";
        }
        return true;
      }
      case "venues":
        return pathname === ROUTES.VENUES;
      case "singers":
        return pathname === ROUTES.SINGERS;
      case "vip":
        return pathname === ROUTES.VIP;
      default:
        return false;
    }
  };

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !user) {
      navigate(getAuthUrl(item.path));
      return;
    }
    navigate(item.path);
  };

  const renderNavItem = (item: NavItem, variant: "mobile" | "desktop") => {
    const active = isActive(item);

    if (variant === "mobile") {
      const mobileClass = `flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
        active
          ? "text-[#955F3B]"
          : "text-[#4b5563] hover:bg-gray-50 hover:text-gray-900"
      }`;
      const mobileStyle = active ? { backgroundColor: brand.primaryLight } : undefined;

      if (item.requiresAuth && !user) {
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavClick(item)}
            className={mobileClass}
            style={mobileStyle}
          >
            <div className={active ? "text-[#955F3B]" : "text-[#4b5563]"}>{item.icon}</div>
            <span>{item.name}</span>
          </button>
        );
      }

      return (
        <Link key={item.id} to={item.path} className={mobileClass} style={mobileStyle}>
          <div className={active ? "text-[#955F3B]" : "text-[#4b5563]"}>{item.icon}</div>
          <span>{item.name}</span>
        </Link>
      );
    }

    const desktopClass = `relative flex w-full flex-col items-center justify-center gap-1.5 px-2 py-4 transition-colors ${
      active
        ? "text-[#955F3B]"
        : "text-[#4b5563] hover:bg-gray-50 hover:text-gray-800"
    }`;
    const desktopStyle = active ? { backgroundColor: brand.primaryLight } : undefined;

    const label = (
      <>
        <div className={active ? "text-[#955F3B]" : "text-[#4b5563]"}>{item.icon}</div>
        <span className="text-center text-[11px] font-semibold leading-tight">{item.name}</span>
      </>
    );

    if (item.requiresAuth && !user) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => handleNavClick(item)}
          className={desktopClass}
          style={desktopStyle}
        >
          {active && (
            <div
              className="absolute bottom-0 left-0 top-0 w-1"
              style={{ backgroundColor: brand.primary }}
            />
          )}
          {label}
        </button>
      );
    }

    return (
      <Link key={item.id} to={item.path} className={desktopClass} style={desktopStyle}>
        {active && (
          <div
            className="absolute bottom-0 left-0 top-0 w-1"
            style={{ backgroundColor: brand.primary }}
          />
        )}
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* MOBILE */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2 text-gray-700">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-white p-0">
            <div className="flex h-full flex-col py-6">
              <div className="mb-8 px-6">
                <SidebarBrand compact />
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto px-4">
                {navItems.map((item) => renderNavItem(item, "mobile"))}
              </nav>

              <div className="mt-auto border-t border-gray-100 px-4 pt-4">
                <button
                  type="button"
                  onClick={openProfile}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-gray-50"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
                    style={{ backgroundColor: brand.primary }}
                  >
                    <span className="text-sm font-semibold text-white">{profileInitial}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user?.name || "Profile"}</p>
                    <p className="text-xs text-gray-500">{user ? "View account" : "Sign in"}</p>
                  </div>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <SidebarBrand compact />

        <div className="w-10" />
      </div>

      <div className="h-16 md:hidden" />

      {/* DESKTOP */}
      <aside
        className="fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-gray-200 bg-white md:flex"
        style={{ width: SIDEBAR_WIDTH_PX }}
      >
        <div className="flex flex-col items-center border-b border-gray-100 px-3 py-5">
          <SidebarBrand />
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => renderNavItem(item, "desktop"))}
        </nav>

        <button
          type="button"
          onClick={openProfile}
          className="flex w-full flex-col items-center gap-1.5 border-t border-gray-100 py-5 transition-colors hover:bg-gray-50"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
            style={{ backgroundColor: brand.primary }}
          >
            <span className="text-sm font-semibold text-white">{profileInitial}</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-600">Profile</span>
        </button>
      </aside>
    </>
  );
};

export default VerticalSidebar;
