import { useParams, Link } from "react-router-dom";
import { movies } from "@/data/movies";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Calendar } from "lucide-react";

const MovieDetail = () => {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const hasTheaters = movie.theaters && movie.theaters.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Movie Banner */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="container pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-lg shadow-2xl"
              />

              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-primary/10 rounded px-3 py-1">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="text-lg font-semibold">{movie.rating}/10</span>
                  </div>
                  <span className="text-muted-foreground">
                    {movie.votes}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genre.map((g) => (
                    <Badge key={g} variant="secondary">
                      {g}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration}</span>
                  </div>
                  <span>•</span>
                  <span>{movie.language}</span>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.releaseDate}</span>
                  </div>
                </div>

                <p className="text-lg mb-4 max-w-3xl">{movie.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Show Times */}
      {hasTheaters ? (
        <section className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Book Tickets</h2>

          <div className="space-y-6">
            {movie.theaters?.map((theater) => (
              <Card key={theater.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{theater.name}</h3>
                      <p className="text-sm text-muted-foreground">{theater.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {theater.showTimes.map((show) => (
                      <Link key={show.showId} to={`/book/${show.showId}`}>
                        <Button
                          variant="outline"
                          className="flex flex-col items-start h-auto py-3 px-4 hover:border-primary"
                        >
                          <span className="font-semibold">{show.time}</span>
                          <span className="text-xs text-muted-foreground">
                            ₹{show.price}
                          </span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <section className="container py-12">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {movie.type === 'stream' 
                  ? 'This content is available for streaming. Check your favorite streaming platforms.'
                  : 'Booking information coming soon.'}
              </p>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
