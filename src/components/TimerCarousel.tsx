import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/data/movies";
import { useNavigate } from "react-router-dom";

interface TimerCarouselProps {
  movies: Movie[];
  autoRotateInterval?: number;
}

const TimerCarousel = ({ movies, autoRotateInterval = 5000 }: TimerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const featuredMovies = movies.slice(0, 5);
  const sideCards = movies.slice(5, 8); // Get 3 movies for side cards

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    setProgress(0);
  }, [featuredMovies.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    if (isPaused || featuredMovies.length === 0) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / (autoRotateInterval / 50));
      });
    }, 50);

    const rotationTimeout = setTimeout(() => {
      goToNext();
    }, autoRotateInterval);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(rotationTimeout);
    };
  }, [currentIndex, isPaused, autoRotateInterval, goToNext, featuredMovies.length]);

  if (!featuredMovies.length) return null;

  const currentMovie = featuredMovies[currentIndex];

  return (
    <div className="relative bg-[#E8DED2] pt-6 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Hero Section - Microsoft Store Style */}
        <div 
          className="flex gap-4 h-[580px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Large Featured Card - 65% width */}
          <div className="relative flex-[0_0_65%] rounded-xl overflow-hidden shadow-2xl group">
            {featuredMovies.map((movie, index) => (
              <div
                key={movie.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Background Image */}
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  {/* Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#107C10] text-white text-xs font-semibold rounded">
                      <span>Game Pass Ultimate + PC</span>
                      <span className="text-white/80">₹ 5,999.00</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
                  
                  {/* Subtitle */}
                  <p className="text-lg text-gray-300 mb-4">Available now</p>

                  {/* Button */}
                  <button
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="w-fit px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded transition-all duration-200"
                  >
                    See details
                  </button>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative w-8 h-1 rounded-full overflow-hidden bg-white/30"
                >
                  {index === currentIndex && (
                    <div
                      className="absolute top-0 left-0 h-full bg-white transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - 3 Stacked Cards - 35% width */}
          <div className="flex-[0_0_35%] flex flex-col gap-4">
            {/* Card 1 - App Awards */}
            <div 
              className="flex-1 rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <div className="h-full flex items-center justify-between p-6 text-white">
                <div>
                  <h3 className="text-2xl font-semibold">App Awards 2025</h3>
                </div>
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 2 - High On Life 2 */}
            {sideCards[0] && (
              <div 
                onClick={() => navigate(`/movie/${sideCards[0].id}`)}
                className="flex-1 rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform duration-200 relative group"
              >
                <img
                  src={sideCards[0].image}
                  alt={sideCards[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-semibold">{sideCards[0].title}</h3>
                </div>
              </div>
            )}

            {/* Card 3 - Goodnotes */}
            {sideCards[1] && (
              <div 
                onClick={() => navigate(`/movie/${sideCards[1].id}`)}
                className="flex-1 rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform duration-200 relative group"
              >
                <img
                  src={sideCards[1].image}
                  alt={sideCards[1].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-semibold">{sideCards[1].title}</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerCarousel;

