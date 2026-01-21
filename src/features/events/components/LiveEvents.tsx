import React from 'react'
import { useState, useEffect } from "react";
import { Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { Movie } from "@/data/movies";
import { Link } from "react-router-dom";

interface LiveEventsProps {
  movie: Movie;
  inCarousel?: boolean;
}


const LiveEvents = ({ movie, inCarousel = false }: LiveEventsProps) => {

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
  //  <div className/>=" flex overflow-x-auto px-4  py-2 snap-x snap-mandatory ">
      <Card
        key={movie.id}
        className={`container group border-0 shadow-none flex-shrink-0 w-[240px] bg-[#F9F8F6]`}
      >
        <div className="relative aspect-[2/2] rounded-xl mt-5">
          <Link to={`/movie/${movie.id}`} onClick={handleLinkClick}>
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover overflow-hidden"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-xl" />
          </Link>

          <Button
            size="icon"
            variant="ghost"
            onClick={handleHeartClick}
            className="absolute top-2 right-2 bg-white/50 hover:bg-white/40 text-[#3F2305] transition-all duration-200 rounded-full"
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                liked ? "fill-[#B17457] text-[#B17457]" : ""
              }`}
            />
          </Button>

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/70 rounded px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-white">
                {movie.rating}/10
              </span>
            </div>
            <span className="text-xs text-white/80">{movie.votes}</span>
          </div>
        </div>

        <CardContent className="p-3">
          <h3 className="font-semibold text-base mb-1 line-clamp-1">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-1 mb-1">
            {movie.genre.slice(0, 2).map((g) => (
              <Badge key={g} variant="secondary" className="text-xs font-medium">
                {g}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {movie.language} • {movie.duration}
          </p>
        </CardContent>
      </Card>
    // </div>

  )
}

export default LiveEvents