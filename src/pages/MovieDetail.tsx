import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { movies } from "@/data/movies";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Calendar, Share2, User, ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const MovieDetail = () => {
  const { id } = useParams();
  const movie = movies.find(m => String(m.id) === id)
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
const [isReviewHovering, setIsReviewHovering] = useState(false);
const reviewCarouselRef = useRef(null);
const reviews = movie?.reviews || [];
const scrollReviewPrev = () => {
  setCurrentReviewIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
};

const scrollReviewNext = () => {
  setCurrentReviewIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev + 1));
};
  if (!movie) {
    return <div>Movie not found</div>;
  }
// Auto-scroll review carousel
useEffect(() => {
  if (isReviewHovering || reviews.length === 0) return;

  const interval = setInterval(() => {
    setCurrentReviewIndex((prevIndex) => {
      const maxIndex = reviews.length - 1;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  }, 4000); // 4 seconds per review

  return () => clearInterval(interval);
}, [isReviewHovering, reviews.length]);

// Scroll to current review index
useEffect(() => {
  if (reviewCarouselRef.current) {
    const scrollWidth = reviewCarouselRef.current.scrollWidth;
    const itemWidth = scrollWidth / reviews.length;
    reviewCarouselRef.current.scrollTo({
      left: itemWidth * currentReviewIndex,
      behavior: 'smooth'
    });
  }
}, [currentReviewIndex, reviews.length]);
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isTrailerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isTrailerOpen]);

  const [expandedFooterSections, setExpandedFooterSections] = useState({
    genre: false,
    help: false,
    language: false,
    cities: false,
    events: false
  });

  // ADD FOOTER FUNCTIONS HERE
  const toggleFooterSection = (section: string) => {
    setExpandedFooterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSocialClick = (platform: string) => {
    console.log(`Opening ${platform}...`);
  };

  const handleFooterLinkClick = (link: string) => {
    console.log(`Navigating to ${link}...`);
  };

  // Get similar movies
  const similarMovies = movies
    .filter((m) => {
      if (m.id === id) return false;
      return m.genre.some(g => movie.genre.includes(g)) || m.type === movie.type;
    })
    .slice(0, 10);

  // Auto-scroll carousel
  useEffect(() => {
    if (isHovering || similarMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = similarMovies.length - 1;
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering, similarMovies.length]);

  // Scroll to current index
  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const itemWidth = scrollWidth / similarMovies.length;
      carouselRef.current.scrollTo({
        left: itemWidth * currentIndex,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, similarMovies.length]);

  const scrollPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? similarMovies.length - 1 : prev - 1));
  };

  const scrollNext = () => {
    setCurrentIndex((prev) => (prev >= similarMovies.length - 1 ? 0 : prev + 1));
  };

  // Component for rendering actor/crew member with fallback
  const PersonCard = ({ person, index }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <div key={index} className="flex flex-col items-center text-center space-y-0.5 w-20 sm:w-24">
        <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
          {!imageError && person.image ? (
            <img
              src={person.image}
              alt={person.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          )}
        </div>
        <h3 className="font-semibold text-xs sm:text-sm line-clamp-2">{person.name}</h3>
        <p className="text-gray-600 text-[10px] sm:text-xs line-clamp-1">{person.role}</p>
      </div>
    );
  };

  // Movie Card Component
  const MovieCard = ({ movie }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <Link 
        to={`/movie/${movie.id}`} 
        className="group flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] mx-1 sm:mx-2"
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="aspect-[2/3] bg-gray-200">
            {!imageError && movie.image ? (
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-3xl sm:text-4xl">🎬</span>
              </div>
            )}
          </div>
          
          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center gap-0.5 sm:gap-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-semibold text-xs sm:text-sm">{movie.rating}</span>
          </div>

          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1">
            <span className="text-gray-800 font-semibold text-[10px] sm:text-xs">{movie.votes}</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 sm:p-3">
            <h3 className="text-white font-bold text-xs sm:text-sm mb-1 line-clamp-2">
              {movie.title}
            </h3>
            <div className="flex flex-wrap gap-1">
              {movie.genre.slice(0, 2).map((g, i) => (
                <span key={i} className="text-gray-300 text-[10px] sm:text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 rounded">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Movie Banner */}
      <section className="relative w-full bg-black">
        <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px]">
          <img
            src={movie.background || movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/60"></div>
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12 max-w-7xl">
            <div className="flex gap-4 sm:gap-8 md:gap-10 items-start sm:items-center">
              <div className="flex-shrink-0">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-32 h-48 sm:w-56 sm:h-80 md:w-64 md:h-96 lg:w-72 lg:h-[430px] object-cover rounded-xl shadow-2xl"
                />
              </div>

              <div className="flex-1 text-white w-full">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 leading-tight">
                  {movie.title}
                </h1>

                <button className="sm:hidden flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors text-sm mb-4">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>

                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 bg-yellow-600/30 border border-yellow-600/50 rounded-lg px-3 sm:px-4 py-2">
                    <Star className="h-5 w-5 sm:h-7 sm:w-7 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg sm:text-2xl">{movie.rating}/10</span>
                  </div>
                  <span className="text-base sm:text-xl text-white/90">{movie.votes}</span>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {movie.genre.map((g) => (
                    <span 
                      key={g} 
                      className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/30 text-base sm:text-base px-4 sm:px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-base sm:text-lg text-white/90 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-base sm:text-lg">{movie.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-base sm:text-lg">{movie.releaseDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-base sm:text-lg text-white/80 mb-6 sm:mb-8">
                  <span>{movie.language}</span>
                  {movie.types && (
                    <>
                      <span>•</span>
                      <span className="bg-white/15 border border-white/20 rounded-lg px-3 py-1.5">
                        {movie.types}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={`/ticket/${movie.id}`}>
                    <Button 
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-4 sm:py-5 px-8 sm:px-12 font-bold text-lg sm:text-lg rounded-xl shadow-2xl hover:shadow-red-600/50 transition-all"
                    >
                      Book Tickets
                    </Button>
                  </Link>

                  <Button 
                    onClick={() => setIsTrailerOpen(true)}
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-2 border-white/50 backdrop-blur-sm text-white py-4 sm:py-5 px-6 sm:px-10 font-bold text-lg sm:text-lg rounded-xl shadow-2xl hover:shadow-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-white" />
                    Watch Trailer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL TRAILER MODAL - YOUTUBE STYLE */}
      {isTrailerOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsTrailerOpen(false)}
        >
          {/* Modal Container */}
          <div 
            className="relative w-full h-full sm:h-auto sm:max-w-7xl bg-black sm:rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Close Button */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <img 
                  src="/placeholder.svg?height=40&width=40" 
                  alt="Logo" 
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/10"
                />
                <div className="hidden sm:block">
                  <h3 className="text-white font-bold text-sm sm:text-base">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-xs">Official Trailer</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
                >
                  Watch later
                </button>
                <button
                  className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={() => setIsTrailerOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 sm:p-2.5 transition-all shadow-lg hover:scale-110 group"
                  aria-label="Close trailer"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative w-full h-full sm:h-auto sm:aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/GUk5tqdV_uk?autoplay=1&rel=0&modestbranding=1&controls=1`}
                title={`${movie.title} - Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Bottom Info Section */}
            <div className="hidden sm:block bg-[#0f0f0f] border-t border-gray-800">
              <div className="p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {movie.title} - Official Trailer
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Watch the exciting trailer in full HD quality. Experience the thrill, action, and emotions of this amazing film.
                </p>
                
                {/* Additional Info */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {movie.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {movie.releaseDate}
                  </span>
                  <span>{movie.language}</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {movie.rating}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT SECTION */}
      <section className="bg-gray-50 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">About the movie</h2>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            {movie.description}
          </p>
        </div>
      </section>

      {/* CAST SECTION */}
      {movie.cast && movie.cast.length > 0 && (
        <section className="py-8 sm:py-10 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Cast</h2>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-start">
              {movie.cast.map((actor, index) => (
                <PersonCard key={index} person={actor} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CREW SECTION */}
      {movie.crew && movie.crew.length > 0 && (
        <section className="py-8 sm:py-10 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Crew</h2>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-start">
              {movie.crew.map((member, index) => (
                <PersonCard key={index} person={member} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

{/* REVIEWS SECTION */}
{/* REVIEWS CAROUSEL SECTION */}
{reviews.length > 0 && (
  <section className="py-10 bg-white">
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Top Reviews</h2>
        <button
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 text-sm sm:text-base"
        >
          {showAllReviews ? "Show Carousel" : "View All"} 
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {/* Conditional: Carousel or Grid */}
      {showAllReviews ? (
        // GRID VIEW - All Reviews
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="relative rounded-xl p-6 bg-white border shadow hover:shadow-lg transition-shadow"
            >
              {/* Quote icon */}
              <div className="absolute top-4 left-4 text-6xl text-red-200 leading-none">
                "
              </div>

              {/* Review text */}
              <p className="text-center text-gray-600 text-sm leading-relaxed mt-6 px-2">
                {review.comment}
              </p>

              {/* Stars */}
              <div className="flex justify-center gap-1 mt-4 text-yellow-400">
                {[...Array(Math.round(review.rating / 2))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>

              {/* User */}
              <div className="mt-4 text-center">
                <p className="font-semibold uppercase tracking-wide text-gray-800">
                  {review.user}
                </p>
                <p className="text-xs text-gray-500">Verified Viewer</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // CAROUSEL VIEW
        <div
          className="relative"
          onMouseEnter={() => setIsReviewHovering(true)}
          onMouseLeave={() => setIsReviewHovering(false)}
        >
          {/* Previous Button */}
          <button
            onClick={scrollReviewPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 -ml-2 sm:-ml-4"
            aria-label="Previous review"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
          </button>

          {/* Carousel Container */}
          <div
            ref={reviewCarouselRef}
            className="flex overflow-hidden scroll-smooth gap-4 sm:gap-6 px-8 sm:px-10"
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="relative rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 border shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  {/* Quote icon */}
                  <div className="absolute top-4 left-4 text-6xl text-red-200 leading-none">
                    "
                  </div>

                  {/* Review text */}
                  <p className="text-center text-gray-600 text-sm leading-relaxed mt-8 px-2 min-h-[80px]">
                    {review.comment}
                  </p>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mt-4 text-yellow-400">
                    {[...Array(Math.round(review.rating / 2))].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400" />
                    ))}
                  </div>

                  {/* User */}
                  <div className="mt-4 text-center border-t pt-4">
                    <p className="font-semibold uppercase tracking-wide text-gray-800">
                      {review.user}
                    </p>
                    <p className="text-xs text-gray-500">Verified Viewer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={scrollReviewNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 -mr-2 sm:-mr-4"
            aria-label="Next review"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
          </button>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReviewIndex(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index === currentReviewIndex
                    ? 'w-6 sm:w-8 bg-red-500'
                    : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
)}



      {/* YOU MIGHT ALSO LIKE CAROUSEL */}
      {similarMovies.length > 0 && (
        <section className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">You might also like</h2>
              <Link 
                to="/" 
                className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 text-sm sm:text-base"
              >
                View All <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 -ml-2 sm:-ml-4"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
              </button>

              <div
                ref={carouselRef}
                className="flex overflow-hidden scroll-smooth gap-2 sm:gap-4 px-8 sm:px-10"
              >
                {similarMovies.map((similarMovie) => (
                  <MovieCard key={similarMovie.id} movie={similarMovie} />
                ))}
              </div>

              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 -mr-2 sm:-mr-4"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
              </button>

              <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                {similarMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-6 sm:w-8 bg-red-500' 
                        : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#333338] text-gray-300">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 text-xs">
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">MOVIES NOW SHOWING</h3>
              <ul className="space-y-1.5">
                {['Dune: Part Two', 'Oppenheimer', 'The Batman', 'Spider-Man', 'Avatar 2', 'Top Gun Maverick'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">MOVIES BY GENRE</h3>
              <ul className="space-y-1.5">
                {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">MOVIES BY LANGUAGE</h3>
              <ul className="space-y-1.5">
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">MOVIES IN TOP CITIES</h3>
              <ul className="space-y-1.5">
                {['Mumbai', 'Delhi-NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    Movies in {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">HELP & SUPPORT</h3>
              <ul className="space-y-1.5">
                {['About Us', 'Contact Us', 'FAQs', 'Terms & Conditions', 'Privacy Policy', 'Careers'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 text-xs">
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">EVENTS</h3>
              <ul className="space-y-1.5">
                {['Live Events', 'Concerts', 'Comedy Shows', 'Workshops', 'Exhibitions'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">PLAYS</h3>
              <ul className="space-y-1.5">
                {['Theatre in Mumbai', 'Theatre in Delhi', 'Theatre in Bangalore', 'Theatre in Chennai'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">SPORTS</h3>
              <ul className="space-y-1.5">
                {['Cricket', 'Football', 'Badminton', 'Tennis', 'Basketball'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">ACTIVITIES</h3>
              <ul className="space-y-1.5">
                {['Adventure Sports', 'Gaming Zones', 'Water Parks', 'Amusement Parks'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3 text-sm">STREAM</h3>
              <ul className="space-y-1.5">
                {['Premiere', 'Rentals', 'New Releases', 'Popular'].map(item => (
                  <li key={item} onClick={() => handleFooterLinkClick(item)} className="cursor-pointer hover:text-white transition-colors">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 my-6"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="text-gray-400">
              © 2025 Book&Watch. All Rights Reserved.
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSocialClick('Facebook')}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialClick('Twitter')}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialClick('Instagram')}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialClick('YouTube')}
                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MovieDetail;