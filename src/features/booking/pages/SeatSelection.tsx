import { useNavigate } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import { Button } from "@/shared/components/ui/button";

const SeatSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Movie booking unavailable</h1>
        <p className="text-muted-foreground mb-6">
          Seat selection is not connected to a live movies API yet. Browse Garba Town events instead.
        </p>
        <Button onClick={() => navigate("/events/list")}>Browse events</Button>
      </div>
    </div>
  );
};

export default SeatSelection;
