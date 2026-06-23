import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import VenueCard from "@/features/venues/components/VenueCard";
import { useGarbaEventCatalog } from "@/features/events/hooks/useGarbaEventCatalog";
import { brand } from "@/shared/constants/theme";
import { Button } from "@/shared/components/ui/button";

const VenuesPage = () => {
  const { venues, isLoading, isError, refetch, isFetching } = useGarbaEventCatalog();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container py-8 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: brand.text }}>
          All venues
        </h1>

        {isLoading && (
          <p className="text-center text-muted-foreground py-12">Loading venues...</p>
        )}

        {!isLoading && isError && (
          <div className="text-center py-12 space-y-4">
            <p className="text-destructive">Could not load venues.</p>
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !isError && venues.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No venues with event photos available right now.
          </p>
        )}

        {!isLoading && venues.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default VenuesPage;
