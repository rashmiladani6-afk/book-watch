import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "@/data/movies";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

      <div className="container px-4 sm:px-6 py-4 sm:py-8">
        {/* Back Button */}
        {/* <Button 
          variant="ghost" 
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="mb-4 sm:mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button> */}

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Seats Section */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6">
              {/* Movie Info */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{movie.title}</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {theater.name} | {showTime.time}
                </p>
              </div>

              {/* Screen Indicator */}
              <div className="mb-4 sm:mb-6">
                <div className="w-full max-w-md mx-auto">
                  <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mb-2"></div>
                  <div className="text-center text-xs sm:text-sm text-muted-foreground">
                    Screen this way
                  </div>
                </div>
              </div>

              {/* Seats Grid - Horizontally Scrollable on Mobile */}
              <div className="overflow-x-auto pb-4">
                <div className="min-w-max mx-auto">
                  {rows.map(row => (
                    <div key={row} className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                      <span className="w-4 sm:w-6 text-xs sm:text-sm font-medium">{row}</span>
                      <div className="flex gap-1 sm:gap-2 flex-1 justify-center">
                        {seats.filter(s => s.row === row).map(seat => (
                          <button
                            key={seat.id}
                            disabled={seat.status === "booked"}
                            onClick={() => toggleSeat(seat.id)}
                            className={`
                              w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10
                              rounded text-[10px] sm:text-xs font-medium
                              transition-all duration-200
                              ${
                                seat.status === "available"
                                  ? "bg-muted border border-border hover:bg-muted/80 hover:scale-105"
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
                      <span className="w-4 sm:w-6 text-xs sm:text-sm font-medium">{row}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted border rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted-foreground/20 rounded"></div>
                    <span>Booked</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-4">
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    Regular ₹{showTime.price}
                  </Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    Premium ₹{premiumPrice}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary Section - Sticky on Desktop, Bottom on Mobile */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-4 sm:p-6">
              <h3 className="font-semibold text-lg sm:text-xl mb-4">Booking Summary</h3>

              {/* Selected Seats */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Selected Seats</p>
                  <p className="text-sm sm:text-base font-medium">
                    {selectedSeats.length > 0 
                      ? selectedSeats.map(s => s.id).join(", ")
                      : "No seats selected"
                    }
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Number of Tickets</span>
                  <span className="text-sm sm:text-base font-semibold">{selectedSeats.length}</span>
                </div>

                {selectedSeats.length > 0 && (
                  <>
                    <div className="border-t pt-3 sm:pt-4 space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Ticket Price</span>
                        <span>₹{calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Convenience Fee</span>
                        <span>₹{selectedSeats.length * 30}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3 sm:pt-4 flex justify-between items-center">
                      <span className="font-semibold text-base sm:text-lg">Total Amount</span>
                      <span className="font-bold text-lg sm:text-xl text-primary">
                        ₹{calculateTotal() + selectedSeats.length * 30}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Button 
                className="w-full mt-4 sm:mt-6 h-10 sm:h-11 text-sm sm:text-base" 
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
              >
                Proceed to Pay
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer - Updated for Better Responsiveness */}
  
    <div className="mt-40">

    
  <footer className="bg-[#333338] text-gray-300" >
        <div className="container py-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 text-xs">

            {/* Column 1 - Movies Now Showing */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">MOVIES NOW SHOWING</h3>
              <ul className="space-y-1.5">
                {['Dune: Part Two', 'Oppenheimer', 'The Batman', 'Spider-Man', 'Avatar 2', 'Top Gun Maverick'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 - Movies By Genre */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">MOVIES BY GENRE</h3>
              <ul className="space-y-1.5">
                {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Movies By Language */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">MOVIES BY LANGUAGE</h3>
              <ul className="space-y-1.5">
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Movies in Top Cities */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">MOVIES IN TOP CITIES</h3>
              <ul className="space-y-1.5">
                {['Mumbai', 'Delhi-NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    Movies in {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5 - Help & Support */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">HELP & SUPPORT</h3>
              <ul className="space-y-1.5">
                {['About Us', 'Contact Us', 'FAQs', 'Terms & Conditions', 'Privacy Policy', 'Careers'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 text-xs">

            {/* Events */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">EVENTS</h3>
              <ul className="space-y-1.5">
                {['Live Events', 'Concerts', 'Comedy Shows', 'Workshops', 'Exhibitions'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Plays */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">PLAYS</h3>
              <ul className="space-y-1.5">
                {['Theatre in Mumbai', 'Theatre in Delhi', 'Theatre in Bangalore', 'Theatre in Chennai'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sports */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">SPORTS</h3>
              <ul className="space-y-1.5">
                {['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">ACTIVITIES</h3>
              <ul className="space-y-1.5">
                {['Adventure Sports', 'Gaming Zones', 'Water Parks', 'Amusement Parks'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Streaming */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">STREAM</h3>
              <ul className="space-y-1.5">
                {['Premiere', 'Rentals', 'New Releases', 'Popular'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-600 my-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            {/* Copyright */}
            <div className="text-gray-400">
              © 2025 Book&Watch. All Rights Reserved.
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSocialClick('Facebook')}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialClick('Twitter')}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialClick('Instagram')}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialClick('YouTube')}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer >
    </div>
    </div>
  );
};

export default SeatSelection;