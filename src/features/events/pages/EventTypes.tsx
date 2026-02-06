import { Link } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import { useEventTypes } from "@/features/events/hooks/useEventTypes";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { generateRoute } from "@/shared/constants/routes";

const EventTypes = () => {
  const { data, isLoading, error } = useEventTypes({ limit: 50, offset: 0 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-muted-foreground">Loading event types...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-destructive">Unable to load event types.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Event Types</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.data.map((t) => (
            <Card key={t.id} className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg">{t.name}</h3>
                {t.notes && <p className="text-sm text-muted-foreground mt-2">{t.notes}</p>}
              </div>
              <div className="mt-4 flex justify-end">
                {/* Navigate to events list filtered by type */}
                <Link to={`/events/list?type=${t.id}`}>
                  <Button variant="outline" size="sm">View events</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventTypes;

