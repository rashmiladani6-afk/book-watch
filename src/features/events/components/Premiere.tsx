import React from 'react'
import { useState, useEffect } from "react";
import {Heart } from "lucide-react";
// import { Card, CardContent } from "@/shared/components/ui/card";
// import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { Movie } from "@/data/movies";
import { Link } from "react-router-dom";



interface PremiereProps {
  movie: Movie;
  inCarousel?: boolean;
}

const Premiere = ({ movie, inCarousel = false }: PremiereProps) => {

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
<div className="flex-shrink-0 w-[230px] rounded-xl overflow-hidden shadow-sm border border-[#F9F8F6]">
           <div className="relative aspect-[2/3] overflow-hidden">
             <Link to={`/movie/${movie.id}`} onClick={handleLinkClick}>
               <img
                 src={movie.image}
                 alt={movie.title}
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
             </Link>
   
             <Button
               size="icon"
               variant="ghost"
               onClick={handleHeartClick}
               className="absolute top-2 right-2 bg-white/50 hover:bg-white/40 text-[#3F2305] transition-all duration-200 rounded-full z-10"
             >
               <Heart
                 className={`h-5 w-5 transition-all duration-300 ${
                   liked ? "fill-[#B17457] text-[#B17457]" : ""
                 }`}
               />
             </Button>

             {/* PREMIERE Badge - bottom left */}
             {/* <div className="absolute bottom-3 left-3 z-10">
               <Badge className="bg-pink-600 hover:bg-pink-600 text-white font-bold text-xs px-3 py-1 uppercase">
                 PREMIERE
               </Badge>
             </div> */}
           </div>
   
           {/* Content section with background color */}
           <div 
             style={{ 
               backgroundColor: 'traspernt',
               padding: '12px',
              //  color: "black"
             }}
           >
             <h3 className="font-semibold text-base mb-0.5 line-clamp-1 text-white">
               {movie.title}
             </h3>
   
             <p className="text-sm text-white/80">
               {movie.language}
             </p>
           </div>
    </div>
  )
}

export default Premiere