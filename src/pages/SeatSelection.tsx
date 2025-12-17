import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "@/data/movies";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

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
  const { user, loading } = useAuth();

  // Find movie, theater, and showtime from the data structure
  let movie, theater, showTime;
  for (const m of movies) {
    if (m.theaters) {
      for (const t of m.theaters) {
        const st = t.showTimes.find((s) => s.showId === showId);
        if (st) {
          movie = m;
          theater = t;
          showTime = st;
          break;
        }
      }
      if (showTime) break;
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to book tickets");
      navigate('/auth', { state: { from: `/book/${showId}` } });
    }
  }, [user, loading, navigate, showId]);

  // Generate seats
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 12;

  const [seats, setSeats] = useState<Seat[]>(
    rows.flatMap((row) =>
      Array.from({ length: seatsPerRow }, (_, i) => ({
        id: `${row}${i + 1}`,
        row,
        number: i + 1,
        status: Math.random() > 0.7 ? "booked" : "available" as SeatStatus,
        type: ["A", "B"].includes(row) ? "premium" : "regular" as "regular" | "premium",
      }))
    )
  );

  const selectedSeats = seats.filter((s) => s.status === "selected");
  const premiumPrice = (showTime?.price || 0) * 1.5;

  const toggleSeat = (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === seatId && seat.status !== "booked"
          ? { ...seat, status: seat.status === "selected" ? "available" : "selected" }
          : seat
      )
    );
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const price = seat.type === "premium" ? premiumPrice : showTime?.price || 0;
      return total + price;
    }, 0);
  };

  const handleProceed = () => {
    if (!user) {
      toast.error("Please sign in to book tickets");
      navigate('/auth');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    const bookingData = {
      movieTitle: movie?.title,
      theaterName: theater?.name,
      showTime: showTime?.time,
      showDate: "Today",
      seats: selectedSeats.map(s => s.id),
      basePrice: showTime?.price || 0,
      totalAmount: calculateTotal() + selectedSeats.length * 30,
    };

    navigate("/payment", { state: bookingData });
  };

  if (!showTime || !movie || !theater) {
    return <div>Show not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/movie/${movie.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movie
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Layout */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
                <p className="text-muted-foreground">
                  {theater.name} | Today | {showTime.time}
                </p>
              </div>

              {/* Screen */}
              <div className="mb-8">
                <div className="w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
                <p className="text-center text-sm text-muted-foreground">Screen this way</p>
              </div>

              {/* Legend */}
              <div className="flex gap-6 mb-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted border" />
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-primary" />
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted-foreground/30" />
                  <span className="text-sm">Booked</span>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="space-y-3">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="w-6 text-sm font-medium text-muted-foreground">
                      {row}
                    </span>
                    <div className="flex gap-2 flex-1 justify-center">
                      {seats
                        .filter((s) => s.row === row)
                        .map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat.id)}
                            disabled={seat.status === "booked"}
                            className={`
                              w-8 h-8 rounded text-xs font-medium transition-all
                              ${
                                seat.status === "available"
                                  ? "bg-muted hover:bg-muted/80 border border-border"
                                  : seat.status === "selected"
                                  ? "bg-primary text-primary-foreground scale-110"
                                  : "bg-muted-foreground/20 cursor-not-allowed"
                              }
                              ${seat.type === "premium" && seat.status === "available" ? "border-primary/50" : ""}
                            `}
                          >
                            {seat.number}
                          </button>
                        ))}
                    </div>
                    <span className="w-6 text-sm font-medium text-muted-foreground">
                      {row}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Info */}
              <div className="mt-8 pt-6 border-t space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Regular</Badge>
                  <span className="text-sm">₹{showTime.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/50">Premium (Rows A-B)</Badge>
                  <span className="text-sm">₹{premiumPrice}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Seats</p>
                  <p className="font-medium">
                    {selectedSeats.length > 0
                      ? selectedSeats.map((s) => s.id).join(", ")
                      : "No seats selected"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Number of Tickets</p>
                  <p className="font-medium">{selectedSeats.length}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Convenience Fee</span>
                    <span className="font-medium">₹{selectedSeats.length * 30}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-xl">
                      ₹{calculateTotal() + selectedSeats.length * 30}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleProceed}
                disabled={selectedSeats.length === 0}
              >
                Proceed to Pay
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
