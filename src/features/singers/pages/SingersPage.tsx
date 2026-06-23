import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import SingerCard from "@/features/singers/components/SingerCard";
import { useGarbaEventCatalog } from "@/features/events/hooks/useGarbaEventCatalog";
import { brand } from "@/shared/constants/theme";
import { Button } from "@/shared/components/ui/button";

const SingersPage = () => {
  const { singers, isLoading, isError, refetch, isFetching } = useGarbaEventCatalog();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container py-8 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: brand.text }}>
          All singers
        </h1>

        {isLoading && (
          <p className="text-center text-muted-foreground py-12">Loading singers...</p>
        )}

        {!isLoading && isError && (
          <div className="text-center py-12 space-y-4">
            <p className="text-destructive">Could not load singers.</p>
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !isError && singers.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No singer groups with event photos available right now.
          </p>
        )}

        {!isLoading && singers.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {singers.map((singer) => (
              <SingerCard key={singer.id} singer={singer} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SingersPage;
