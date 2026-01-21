import { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { Movie } from "@/data/movies";
import { Link } from "react-router-dom";

interface TopGames_SportsEventsProps {
  movie: Movie;
  inCarousel?: boolean;
}

const TopGames_SportsEvents = ({ movie, inCarousel = false }: TopGames_SportsEventsProps) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const savedFavorites: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (savedFavorites.includes(String(movie.id))) {
      setLiked(true);
    }
  }, [movie.id]);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const savedFavorites: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (liked) {
      const updatedFavorites = savedFavorites.filter((id) => id !== String(movie.id));
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setLiked(false);
    } else {
      const updatedFavorites = [...savedFavorites, String(movie.id)];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setLiked(true);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#B17457] fill-[#B17457]" />
            <span>Added to Favorites</span>
          </div>
        ) as unknown as string,
        description: `${movie.title} has been added to your favorites.`,
      });
    }
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
   return (
    <Card className={`group border-0 shadow-none ${inCarousel ? 'flex-shrink-0 w-[280px] snap-center' : ''}`}>
      <div className="relative aspect-[2/3]">
        <Link to={`/movie/${movie.id}`} onClick={handleLinkClick}>
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F1E4C3] via-transparent to-transparent rounded-lg" />
        </Link>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleHeartClick}
          className="absolute top-2 right-2 bg-white/40 hover:bg-white/30 text-[#3F2305] transition-all duration-200"
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              liked ? "fill-[#B17457] text-[#FDF7F4]" : ""
            }`}
          />
        </Button>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 bg-black/60 rounded px-2 py-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-white">
                {movie.rating}/10
              </span>
            </div>
            <span className="text-xs text-white/80">{movie.votes}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genre.slice(0, 2).map((g) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {movie.language} • {movie.duration}
        </p>
      </CardContent>
    </Card>
  );
};

export default TopGames_SportsEvents