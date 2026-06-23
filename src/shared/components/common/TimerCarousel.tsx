import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { brand } from "@/shared/constants/theme";

interface EventCarouselItem {
  id: number | string;
  title: string;
  image: string;
  subtitle?: string;
  price?: number;
  address?: string;
}

interface TimerCarouselProps {
  autoRotateInterval?: number;
  eventSlides?: EventCarouselItem[];
}

const TimerCarousel = ({
  autoRotateInterval = 5000,
  eventSlides = [],
}: TimerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const featuredItems = eventSlides.slice(0, 5);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    setProgress(0);
  }, [featuredItems.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    if (featuredItems.length === 0) return;

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
  }, [currentIndex, autoRotateInterval, goToNext, featuredItems.length]);

  if (!featuredItems.length) return null;

  return (
    <div className="relative bg-white pt-4 pb-6 md:pt-6 md:pb-8">
      <div className="container mx-auto px-3 sm:px-4">
        <div
          className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] rounded-xl overflow-hidden group"
          style={{ boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.25)" }}
        >
          {featuredItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10 text-white">
                <span
                  className="inline-flex w-fit items-center px-3 py-1 text-xs font-semibold rounded-full mb-3"
                  style={{ backgroundColor: brand.primary }}
                >
                  Popular
                </span>

                {item.price != null && item.price > 0 && (
                  <p className="text-sm sm:text-base font-medium text-white/90 mb-1">
                    Rs. {item.price} onwards
                  </p>
                )}

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 max-w-2xl">
                  {item.title}
                </h2>

                {(item.address || item.subtitle) && (
                  <p className="flex items-center gap-1.5 text-sm sm:text-base text-gray-300 mb-4 max-w-xl">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{item.address || item.subtitle}</span>
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => navigate(`/events/${item.id}`)}
                  className="w-fit px-6 py-2.5 text-sm sm:text-base font-semibold text-white rounded-md transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: brand.primary }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}

          {featuredItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrev}
                className="hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {featuredItems.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-white scale-110" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
                <div className="relative w-5 h-5">
                  <svg className="w-full h-full" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="15.5"
                      fill="rgba(0, 0, 0, 0.5)"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="0.5"
                    />
                    <path
                      d={`M 16 16 L 16 0.5 A 15.5 15.5 0 ${progress > 50 ? 1 : 0} 1 ${
                        16 + 15.5 * Math.sin((progress * 2 * Math.PI) / 100)
                      } ${16 - 15.5 * Math.cos((progress * 2 * Math.PI) / 100)} Z`}
                      fill="rgba(255, 255, 255, 0.85)"
                    />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerCarousel;
