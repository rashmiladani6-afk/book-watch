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
  const sideCards = movies.slice(5, 9);

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
    if (featuredMovies.length === 0) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (autoRotateInterval / 50);
        if (prev + increment >= 100) return 100;
        return prev + increment;
      });
    }, 50);

    const rotationTimeout = setTimeout(() => {
      goToNext();
    }, autoRotateInterval);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(rotationTimeout);
    };
  }, [currentIndex, autoRotateInterval, goToNext, featuredMovies.length]);

  if (!featuredMovies.length) return null;

  return (
    <div className="relative bg-[#E8DED2] pt-4 pb-6 md:pt-6 md:pb-8">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Mobile: Stack vertically, Tablet+: Side by side */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5">
          {/* Left Large Featured Card */}
          <div className="relative w-full lg:flex-[0_0_65%] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg sm:rounded-xl overflow-hidden shadow-xl lg:shadow-2xl group">
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
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 text-white">
                  {/* Badge */}
                  <div className="mb-2 sm:mb-3">
                    <span className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-[#107C10] text-white text-[10px] sm:text-xs font-semibold rounded">
                      <span className="hidden sm:inline">Game Pass Ultimate + PC</span>
                      <span className="sm:hidden">Game Pass</span>
                      <span className="text-white/80">₹ 5,999.00</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                    {movie.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-3 sm:mb-4">
                    Available now
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="w-fit px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded transition-all duration-200"
                  >
                    See details
                  </button>

                  {/* Circular Timer - Below See details button */}
                  <div className="mt-3 sm:mt-4">
                    <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                      <svg className="w-full h-full" viewBox="0 0 32 32">
                        {/* Background circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="15.5"
                          fill="rgba(0, 0, 0, 0.5)"
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="0.5"
                        />
                        {/* Progress pie using path */}
                        <path
                          d={`M 16 16 L 16 0.5 A 15.5 15.5 0 ${progress > 50 ? 1 : 0} 1 ${
                            16 + 15.5 * Math.sin((progress * 2 * Math.PI) / 100)
                          } ${
                            16 - 15.5 * Math.cos((progress * 2 * Math.PI) / 100)
                          } Z`}
                          fill="rgba(255, 255, 255, 0.85)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows - Hidden on mobile */}
            <button
              onClick={goToPrev}
              className="hidden sm:block absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={goToNext}
              className="hidden sm:block absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dot Indicators - Bottom center */}
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-2.5 z-10">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white scale-110' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="w-full lg:flex-[0_0_35%] flex flex-col gap-3 sm:gap-4">
            {/* Top Card - App Awards */}
            <div
              className="h-[180px] sm:h-[220px] md:h-[280px] lg:h-[340px] rounded-lg sm:rounded-xl overflow-hidden shadow-md lg:shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <div className="h-full flex items-center justify-between p-4 sm:p-5 lg:p-6 text-white">
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    App Awards 2025
                  </h3>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Row - Two cards side by side */}
            <div className="h-[140px] sm:h-[180px] md:h-[200px] lg:h-[240px] flex gap-3 sm:gap-4">
              {/* Bottom-Left Card */}
              {sideCards[0] && (
                <div
                  onClick={() => navigate(`/movie/${sideCards[0].id}`)}
                  className="flex-1 rounded-lg sm:rounded-xl overflow-hidden shadow-md lg:shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform duration-200 relative group"
                >
                  <img
                    src={sideCards[0].image}
                    alt={sideCards[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4 text-white">
                    <h3 className="text-xs sm:text-sm lg:text-lg font-semibold line-clamp-2">
                      {sideCards[0].title}
                    </h3>
                  </div>
                </div>
              )}

              {/* Bottom-Right Card */}
              {sideCards[1] && (
                <div
                  onClick={() => navigate(`/movie/${sideCards[1].id}`)}
                  className="flex-1 rounded-lg sm:rounded-xl overflow-hidden shadow-md lg:shadow-lg cursor-pointer transform hover:scale-[1.02] transition-transform duration-200 relative group"
                >
                  <img
                    src={sideCards[1].image}
                    alt={sideCards[1].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4 text-white">
                    <h3 className="text-xs sm:text-sm lg:text-lg font-semibold line-clamp-2">
                      {sideCards[1].title}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerCarousel;