import { Link } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

const MovieDetail = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-20 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Movies unavailable</h1>
        <p className="text-muted-foreground mb-6">
          This app currently shows live Garba Town events only. Movie listings are not connected yet.
        </p>
        <Link to="/events/list">
          <Button>Browse events</Button>
        </Link>
        <div className="mt-4">
          <Link to={ROUTES.HOME} className="text-sm text-muted-foreground hover:underline">
            Back to home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetail;
