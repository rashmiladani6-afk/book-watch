import { useState } from "react";
import { Search, User, LogOut, MapPin, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

const popularCities = [
  { name: "Mumbai", icon: "🏢" },
  { name: "Delhi-NCR", icon: "🏛️" },
  { name: "Bengaluru", icon: "🏙️" },
  { name: "Hyderabad", icon: "🏰" },
  { name: "Chandigarh", icon: "🏛️" },
  { name: "Ahmedabad", icon: "🏰" },
  { name: "Pune", icon: "🏙️" },
  { name: "Kolkata", icon: "🏛️" },
  { name: "Kochi", icon: "🏝️" },
];

const allCities = [
  "Aalo", "Abohar", "Abu Road", "Achampet", "Acharapakkam", "Adampur", "Adilabad",
  "Adimali", "Adipur", "Adoni", "Agra", "Ahmedabad", "Ajmer", "Amritsar", "Bengaluru",
  "Bhopal", "Chandigarh", "Chennai", "Delhi", "Goa", "Hyderabad", "Indore", "Jaipur",
  "Kochi", "Kolkata", "Lucknow", "Mumbai", "Pune", "Surat", "Vadodara", "Visakhapatnam",
];

const sortedCities = [...allCities].sort((a, b) => a.localeCompare(b));

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const detectLocation = () => {
    toast.info("Detecting your location...");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      setShowMobileSearch(false);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Failed to sign out");
    else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setShowModal(false);
    toast.success(`City selected: ${cityName}`);
  };

  const toggleShowAllCities = () => setShowAllCities((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-5 flex-1 justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <h1
              className="text-2xl md:text-4xl font-serif italic tracking-wide"
              style={{ color: "#C9B194" }}
            >
              book
              <span style={{ color: "#F1F0E4" }}>&</span>
              watch
            </h1>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 max-w-md lg:max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B5E3C]" />
              <Input
                placeholder="Search for Movies, Events, Plays, Sports"
                className="pl-10 pr-10 border border-gray-300 focus:border-[#8B5E3C] focus:ring-0 focus:outline-none text-[#3E2723]"
                style={{ boxShadow: "none", outline: "none" }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    if (onSearch) onSearch("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="bg-[#8B5E3C] hover:bg-[#5C4033] text-white shrink-0"
            >
              Search
            </Button>
          </form>

          {/* Empty div to balance the layout */}
          <div className="hidden md:block shrink-0 w-[100px]"></div>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#8B5E3C]"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* City Select */}
          <Button
            variant="default"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 md:gap-2 bg-[#8B5E3C] hover:bg-[#5B3A38] text-xs md:text-sm px-2 md:px-4"
          >
            <MapPin className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">
              {selectedCity ? selectedCity : "Select City"}
            </span>
            <span className="sm:hidden">City</span>
          </Button>

          {/* Account */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2 md:px-4">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="px-2 md:px-4 hover:bg-[#E6D8C3]">
                <User className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col">
          <div className="border-b bg-white p-4">
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B5E3C]" />
                  <Input
                    autoFocus
                    placeholder="Search for Movies, Events, Plays, Sports"
                    className="pl-10 pr-10 border border-gray-300 focus:border-[#8B5E3C] focus:ring-0 focus:outline-none rounded-lg"
                    style={{ boxShadow: "none", outline: "none" }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        if (onSearch) onSearch("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="bg-[#8B5E3C] hover:bg-[#5C4033] text-white shrink-0"
                >
                  Go
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* City Modal (Responsive Updated) */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="w-[90vw] sm:max-w-lg max-h-[80vh] text-[#5B3A38] overflow-y-auto rounded-lg sm:rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Select Your City</DialogTitle>
          </DialogHeader>

          <Button
            variant="ghost"
            onClick={detectLocation}
            className="text-[#8B5E3C] bg-[#F7F7F7] hover:text-[#C2A68C] mb-3 flex items-center gap-2 hover:bg-[#EFE9E3]"
          >
            📍 Detect my location
          </Button>

          {!showAllCities ? (
            <>
              <h3 className="text-center font-semibold mb-3">Popular Cities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {popularCities.map((city, i) => (
                  <button
                    key={i}
                    onClick={() => handleCitySelect(city.name)}
                    className="border rounded-md p-3 hover:bg-gray-100 text-center transition"
                  >
                    <div className="text-2xl">{city.icon}</div>
                    <p className="text-sm">{city.name}</p>
                  </button>
                ))}
              </div>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={toggleShowAllCities}
                  className="text-[#B17457] underline"
                >
                  Show all cities
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-center font-semibold mb-3">All Cities</h3>
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[60vh] sm:max-h-60 px-2">
                {sortedCities.map((city, i) => (
                  <p
                    key={i}
                    onClick={() => handleCitySelect(city)}
                    className="cursor-pointer text-[#B17457] hover:text-[#C2A68C]"
                  >
                    {city}
                  </p>
                ))}
              </div>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={toggleShowAllCities}
                  className="text-[#B17457] underline"
                >
                  Hide all cities
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
