import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "@/data/movies";
import Header from "@/shared/components/layout/Header";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

type SeatStatus = "available" | "selected" | "booked";

interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: "regular" | "premium";
}

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [expandedFooterSections, setExpandedFooterSections] = useState({
    genre: false,
    help: false,
    language: false,
    cities: false,
    events: false
  });

  // Footer Functions
  const toggleFooterSection = (section: string) => {
    setExpandedFooterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSocialClick = (platform: string) => {
    console.log(`Opening ${platform}...`);
  };

  const handleFooterLinkClick = (link: string) => {
    console.log(`Navigating to ${link}...`);
  };

  let movie, theater, showTime;
  for (const m of movies) {
    for (const t of m.theaters || []) {
      const st = t.showTimes.find(s => s.showId === showId);
      if (st) {
        movie = m;
        theater = t;
        showTime = st;
        break;
      }
    }
  }

  if (!movie || !theater || !showTime) {
    return <div className="text-center py-20">Show not found</div>;
  }

  const rows = ["A","B","C","D","E","F","G","H","I","J"];
  const seatsPerRow = 12;

  const [seats, setSeats] = useState<Seat[]>(
    rows.flatMap(row =>
      Array.from({ length: seatsPerRow }, (_, i) => ({
        id: `${row}${i + 1}`,
        row,
        number: i + 1,
        status: Math.random() > 0.7 ? "booked" : "available",
        type: ["A","B"].includes(row) ? "premium" : "regular",
      }))
    )
  );

  const selectedSeats = seats.filter(s => s.status === "selected");
  const premiumPrice = showTime.price * 1.5;

  const toggleSeat = (id: string) => {
    setSeats(prev =>
      prev.map(seat =>
        seat.id === id && seat.status !== "booked"
          ? { ...seat, status: seat.status === "selected" ? "available" : "selected" }
          : seat
      )
    );
  };

  const calculateTotal = () =>
    selectedSeats.reduce((t, s) =>
      t + (s.type === "premium" ? premiumPrice : showTime.price), 0
    );

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    navigate("/payment", {
      state: {
        movieTitle: movie.title,
        theaterName: theater.name,
        showTime: showTime.time,
        seats: selectedSeats.map(s => s.id),
        totalAmount: calculateTotal() + selectedSeats.length * 30,
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="w-full px-2 sm:px-4 md:px-6 py-3 sm:py-6 md:py-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-8">
          {/* Seats Section */}
          <div className="lg:col-span-2">
            <Card className="p-3 sm:p-5 md:p-6">
              {/* Movie Info */}
              <div className="mb-3 sm:mb-5 md:mb-6">
                <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-1">{movie.title}</h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  {theater.name} | {showTime.time}
                </p>
              </div>

              {/* Seats Grid - Mobile Optimized */}
              <div className="overflow-x-auto overflow-y-visible pb-3 -mx-3 px-3 sm:mx-0 sm:px-0">
                <div className="inline-block min-w-full">
                  <div className="mx-auto w-fit">
                    {rows.map(row => (
                      <div key={row} className="flex items-center justify-center gap-[3px] sm:gap-1 md:gap-2 mb-1 sm:mb-1.5">
                        {/* Left Row Label */}
                        <span className="w-3 sm:w-4 md:w-6 text-[9px] sm:text-xs md:text-sm font-medium text-muted-foreground text-center flex-shrink-0">
                          {row}
                        </span>
                        
                        {/* Seats */}
                        <div className="flex gap-[3px] sm:gap-1 md:gap-2">
                          {seats.filter(s => s.row === row).map(seat => (
                            <button
                              key={seat.id}
                              disabled={seat.status === "booked"}
                              onClick={() => toggleSeat(seat.id)}
                              className={`
                                w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-10 lg:h-10
                                rounded text-[8px] sm:text-[10px] md:text-xs font-medium
                                transition-all duration-200 flex-shrink-0
                                ${
                                  seat.status === "available"
                                    ? "bg-muted border border-border hover:bg-muted/80 active:scale-95"
                                    : seat.status === "selected"
                                    ? "bg-primary text-white scale-105 shadow-md"
                                    : "bg-muted-foreground/20 cursor-not-allowed opacity-50"
                                }
                              `}
                            >
                              {seat.number}
                            </button>
                          ))}
                        </div>
                        
                        {/* Right Row Label */}
                        <span className="w-3 sm:w-4 md:w-6 text-[9px] sm:text-xs md:text-sm font-medium text-muted-foreground text-center flex-shrink-0">
                          {row}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Screen Indicator at Bottom */}
              <div className="mt-3 sm:mt-5 mb-3 sm:mb-5">
                <div className="w-full max-w-md mx-auto px-2">
                  <div className="text-center text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Screen this way
                  </div>
                  <div className="h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded"></div>
                </div>
              </div>

              {/* Legend */}
              <div className="pt-3 sm:pt-5 border-t">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-muted border rounded flex-shrink-0"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-primary rounded flex-shrink-0"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-muted-foreground/20 rounded flex-shrink-0"></div>
                    <span>Booked</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                  <Badge variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">
                    Regular ₹{showTime.price}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">
                    Premium ₹{premiumPrice}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Summary - Sticky on Desktop */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-3 sm:p-5 md:p-6">
              <h3 className="font-semibold text-sm sm:text-lg md:text-xl mb-3 sm:mb-4">
                Booking Summary
              </h3>

              <div className="space-y-2 sm:space-y-3">
                {/* Selected Seats */}
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">
                    Selected Seats
                  </p>
                  <p className="text-xs sm:text-sm md:text-base font-medium break-words leading-relaxed">
                    {selectedSeats.length > 0 
                      ? selectedSeats.map(s => s.id).join(", ")
                      : "No seats selected"
                    }
                  </p>
                </div>

                {/* Number of Tickets */}
                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Number of Tickets
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-semibold">
                    {selectedSeats.length}
                  </span>
                </div>

                {selectedSeats.length > 0 && (
                  <>
                    {/* Price Breakdown */}
                    <div className="border-t pt-2 sm:pt-3 space-y-1.5">
                      <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                        <span>Ticket Price</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                        <span>Convenience Fee</span>
                        <span>₹{selectedSeats.length * 30}</span>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="border-t pt-2 sm:pt-3 flex justify-between items-center">
                      <span className="font-semibold text-xs sm:text-base md:text-lg">
                        Total Amount
                      </span>
                      <span className="font-bold text-sm sm:text-lg md:text-xl text-primary">
                        ₹{calculateTotal() + selectedSeats.length * 30}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Proceed Button */}
              <Button 
                className="w-full mt-3 sm:mt-5 h-9 sm:h-10 md:h-11 text-xs sm:text-sm md:text-base font-semibold" 
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
              >
                Proceed to Pay
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 sm:mt-16 lg:mt-32">
        <footer className="bg-[#333338] text-gray-300">
          <div className="w-full px-3 sm:px-6 py-5 sm:py-8">
            {/* Main Footer Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6 mb-5 sm:mb-8 text-[10px] sm:text-xs">
              
              {/* Column 1 */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">
                  Movies Now Showing
                </h3>
                <ul className="space-y-1">
                  {['Dune: Part Two', 'Oppenheimer', 'The Batman', 'Spider-Man', 'Avatar 2', 'Top Gun'].map(item => (
                    <li 
                      key={item} 
                      onClick={() => handleFooterLinkClick(item)} 
                      className="cursor-pointer hover:text-white transition-colors truncate"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">
                  Movies by Genre
                </h3>
                <ul className="space-y-1">
                  {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'].map(item => (
                    <li 
                      key={item} 
                      onClick={() => handleFooterLinkClick(item)} 
                      className="cursor-pointer hover:text-white transition-colors truncate"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3 */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">
                  Movies by Language
                </h3>
                <ul className="space-y-1">
                  {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'].map(item => (
                    <li 
                      key={item} 
                      onClick={() => handleFooterLinkClick(item)} 
                      className="cursor-pointer hover:text-white transition-colors truncate"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4 */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">
                  Top Cities
                </h3>
                <ul className="space-y-1">
                  {['Mumbai', 'Delhi-NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'].map(item => (
                    <li 
                      key={item} 
                      onClick={() => handleFooterLinkClick(item)} 
                      className="cursor-pointer hover:text-white transition-colors truncate"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 5 */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">
                  Help & Support
                </h3>
                <ul className="space-y-1">
                  {['About Us', 'Contact Us', 'FAQs', 'Terms', 'Privacy', 'Careers'].map(item => (
                    <li 
                      key={item} 
                      onClick={() => handleFooterLinkClick(item)} 
                      className="cursor-pointer hover:text-white transition-colors truncate"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-6 mb-5 sm:mb-8 text-[10px] sm:text-xs">
              
              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">Events</h3>
                <ul className="space-y-1">
                  {['Live Events', 'Concerts', 'Comedy Shows', 'Workshops'].map(item => (
                    <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors truncate">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">Plays</h3>
                <ul className="space-y-1">
                  {['Theatre Mumbai', 'Theatre Delhi', 'Theatre Bangalore'].map(item => (
                    <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors truncate">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">Sports</h3>
                <ul className="space-y-1">
                  {['Cricket', 'Football', 'Badminton', 'Tennis'].map(item => (
                    <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors truncate">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">Activities</h3>
                <ul className="space-y-1">
                  {['Adventure Sports', 'Gaming', 'Water Parks'].map(item => (
                    <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors truncate">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-0">
                <h3 className="text-white font-semibold mb-2 text-[11px] sm:text-sm uppercase">Stream</h3>
                <ul className="space-y-1">
                  {['Premiere', 'Rentals', 'New Releases'].map(item => (
                    <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors truncate">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-600 my-4"></div>

            {/* Bottom Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-xs">
              <div className="text-gray-400">
                © 2025 Book&Watch. All Rights Reserved.
              </div>

              {/* Social Icons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => handleSocialClick('Facebook')}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => handleSocialClick('Twitter')}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => handleSocialClick('Instagram')}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => handleSocialClick('YouTube')}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SeatSelection;