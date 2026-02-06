import { useState, useRef, useEffect } from "react";
import { movies as allMovies, ContentType } from "@/data/movies";

import MovieCard from "@/features/movies/components/MovieCard";

import Header from "@/shared/components/layout/Header";
import TimerCarousel from "@/shared/components/common/TimerCarousel";
import { Button } from "@/shared/components/ui/button";
import { ChevronRight, ChevronLeft, ChevronDown, Briefcase, Film, Trophy, Music, Search } from "lucide-react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useEventTypes } from "@/features/events/hooks/useEventTypes";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { generateRoute } from "@/shared/constants/routes";

// TODO: If needed, import play button asset from the centralized assets path:
// import playButton from "@/assets/image/play-button/Watch-new-movies-at-home-every-Friday-3.png";

/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 📂 ESSENTIAL EVENTS DATA (Specific Items)                                 */
/* -------------------------------------------------------------------------- */
const essentialEvents = [
  {
    id: 'avatar',
    listTitle: 'Avatar: The Way of Water',
    listDesc: 'Sci-Fi • 3h 12m',
    heroTitle: 'Avatar: The Way of Water',
    heroSubtitle: 'Set more than a decade after the events of the first film, learn the story of the Sully family and the trouble that follows them.',
    buttonText: 'Book Now',
    color: 'bg-[#0B5394]', // Ocean Blue
    textColor: 'text-white',
    tags: ['UA', 'Sci-Fi', 'IMAX'],
    image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC44LzEwICAxLjZLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00443704-njctmveaay-portrait.jpg',
    icon: <Film size={24} />,
    category: 'movie'
  },
  {
    id: 'dune',
    listTitle: 'Dune: Part Two',
    listDesc: 'Sci-Fi • 2h 46m',
    heroTitle: 'Dune: Part Two',
    heroSubtitle: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge.',
    buttonText: 'Book Now',
    color: 'bg-[#C19A6B]', // Sand/Gold
    textColor: 'text-white',
    tags: ['UA', 'Sci-Fi', 'Blockbuster'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Q3wmpqxNyP8TXdlT4WSsCsPj15Dak_IEIQ&s',
    icon: <Film size={24} />,
    category: 'movie'
  },
  {
    id: 'ipl',
    listTitle: 'IPL 2025: MI vs CSK',
    listDesc: 'Cricket • Wankhede Stadium',
    heroTitle: 'MI vs CSK - El Clasico',
    heroSubtitle: 'The biggest rivalry in cricket history returns. Don\'t miss the action live.',
    buttonText: 'Book Now',
    color: 'bg-[#9A9D9B]', // MI Blue
    textColor: 'text-white',
    tags: ['Sports', 'Cricket', 'Live'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdc4sZ7IWMPOHIIjNDpVx7eZMQCkiRkjAitg&s',
    icon: <Trophy size={24} />,
    category: 'event'
  },
  {
    id: 'coldplay',
    listTitle: 'Coldplay: MOTS',
    listDesc: 'Concert • DY Patil Stadium',
    heroTitle: 'Coldplay: Music of the Spheres',
    heroSubtitle: 'Experience the magical world tour live in Mumbai. A spectacle of lights and music.',
    buttonText: 'Join Waitlist',
    color: 'bg-[#6a3093]', // Purple
    textColor: 'text-white',
    tags: ['Music', 'Live', 'Concert'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv-S5DxtEmv6yIU5mzqj3whQdbAVc6Q2NURQ&s',
    icon: <Music size={24} />,
    category: 'event'
  },
  {
    id: 'oppenheimer',
    listTitle: 'Oppenheimer',
    listDesc: 'Biography • 3h 00m',
    heroTitle: 'Oppenheimer',
    heroSubtitle: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    buttonText: 'Book Now',
    color: 'bg-[#3E2723]', // Dark Brown
    textColor: 'text-white',
    tags: ['A', 'Biography', 'Drama'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNbm28EZhooHofMhqRbjqYXm58jMZo87-n1A&s',
    icon: <Film size={24} />,
    category: 'movie'
  }
];

/* -------------------------------------------------------------------------- */
/* 🎞 UNIVERSAL CAROUSEL COMPONENT                                           */
/* -------------------------------------------------------------------------- */
const CarouselSection = ({
  title,
  movies,
  keyPrefix,
  useLiveEvents = false,
  useMusicStudio = false,
  useLaughterTherapy = false,
  usePopularEvents = false,
  useLatestPlays = false,
  useTopTopGames_SportsEvents = false,
  useFunACtivities = false
}: {
  title: string;
  movies: any[];
  keyPrefix: string;
  useLiveEvents?: boolean;
  useMusicStudio?: boolean;
  useLaughterTherapy?: boolean;
  usePopularEvents?: boolean;
  useLatestPlays?: boolean;
  useTopTopGames_SportsEvents?: boolean
  useFunACtivities?: boolean
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="container pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        {/* all title color browen */}
        <h2
          className="text-2xl font-bold bg-gradient-to-r from-[#6d492e] via-[#a67149] to-[#d0c0b0] text-transparent bg-clip-text"
        >
          {title}
        </h2>


        <Button
          variant="ghost"
          className="text-[#8B5E3C] hover:text-white hover:bg-[#E6D8C3]"
        >
          See All
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* LIVE EVENTS GRID (NO CAROUSEL) */}
      {useLiveEvents ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <LiveEvents
              key={`${keyPrefix}-${movie.id}`}
              movie={movie}
              inCarousel={false}
            />
          ))}
        </div>
      ) : (
        /* -------------------------------------------------------------- */
        /* DEFAULT CAROUSEL (Movies, Music Studio, Laughter Therapy etc.) */
        /* -------------------------------------------------------------- */
        <div className="relative group">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 z-10 opacity-0 group-hover:opacity-100 transition -ml-5"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 z-10 opacity-0 group-hover:opacity-100 transition -mr-5"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            <div className="flex gap-4 pb-4">
              {movies.map((movie) => (
                <MovieCard
                  key={`${keyPrefix}-${movie.id}`}
                  movie={movie}
                  inCarousel={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 🏠 HOME PAGE                                                               */
/* -------------------------------------------------------------------------- */
const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<ContentType | "all">(
    "all"
  );
  const [activeEvent, setActiveEvent] = useState(essentialEvents[0]);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'event'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const trendingGamesRef = useRef<HTMLDivElement>(null);
  const trendingAppsRef = useRef<HTMLDivElement>(null);
  const featuredGamesRef = useRef<HTMLDivElement>(null);
  const mustWatchRef = useRef<HTMLDivElement>(null);

  // Live events from Dwaaro API
  const { user, loading: authLoading } = useAuth();
  const { data: eventsData } = useEvents({ limit: 8, offset: 0 });
  const { data: typesData } = useEventTypes({ limit: 50, offset: 0 });
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  // Auto scroll for Best Selling Games section
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const currentScroll = scrollRef.current.scrollLeft;

        if (currentScroll >= maxScroll) {
          // Reset to start
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll right
          scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
        }
      }
    }, 3000); // Auto scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Auto scroll for Trending Games
  useEffect(() => {
    const interval = setInterval(() => {
      if (trendingGamesRef.current) {
        const maxScroll = trendingGamesRef.current.scrollWidth - trendingGamesRef.current.clientWidth;
        const currentScroll = trendingGamesRef.current.scrollLeft;

        if (currentScroll >= maxScroll) {
          trendingGamesRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          trendingGamesRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll for Trending Apps
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (trendingAppsRef.current) {
  //       const maxScroll = trendingAppsRef.current.scrollWidth - trendingAppsRef.current.clientWidth;
  //       const currentScroll = trendingAppsRef.current.scrollLeft;

  //       if (currentScroll >= maxScroll) {
  //         trendingAppsRef.current.scrollTo({ left: 0, behavior: "smooth" });
  //       } else {
  //         trendingAppsRef.current.scrollBy({ left: 300, behavior: "smooth" });
  //       }
  //     }
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, []);

  // Auto scroll for Featured Free Games
  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredGamesRef.current) {
        const maxScroll = featuredGamesRef.current.scrollWidth - featuredGamesRef.current.clientWidth;
        const currentScroll = featuredGamesRef.current.scrollLeft;

        if (currentScroll >= maxScroll) {
          featuredGamesRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          featuredGamesRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // // Auto scroll for Must Watch Movies
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (mustWatchRef.current) {
  //       const maxScroll = mustWatchRef.current.scrollWidth - mustWatchRef.current.clientWidth;
  //       const currentScroll = mustWatchRef.current.scrollLeft;

  //       if (currentScroll >= maxScroll) {
  //         mustWatchRef.current.scrollTo({ left: 0, behavior: "smooth" });
  //       } else {
  //         mustWatchRef.current.scrollBy({ left: 300, behavior: "smooth" });
  //       }
  //     }
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  // ADD FOOTER STATE HERE
  // Auto scroll for Must Watch Movies
  useEffect(() => {
    const interval = setInterval(() => {
      if (mustWatchRef.current) {
        const maxScroll = mustWatchRef.current.scrollWidth - mustWatchRef.current.clientWidth;
        const currentScroll = mustWatchRef.current.scrollLeft;

        if (currentScroll >= maxScroll) {
          mustWatchRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          mustWatchRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    // You can add actual social media links here
  };

  const handleFooterLinkClick = (link: string) => {
    console.log(`Navigating to ${link}...`);
    // You can add actual navigation logic here
  };

  /* SEARCH + CATEGORY FILTER */
  const filteredMovies = allMovies.filter((movie) => {
    const matchCategory =
      selectedCategory === "all" || movie.type === selectedCategory;

    const matchSearch =
      searchQuery === "" ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.some((g) =>
        g.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchCategory && matchSearch;
  });

  /* CATEGORY ARRAYS */
  const recommendedMovies = filteredMovies.filter((m) => m.type === "movies");
  const streamMovies = filteredMovies.filter((m) => m.type === "stream");
  const eventMovies = filteredMovies.filter((m) => m.type === "events");
  const playMovies = filteredMovies.filter((m) => m.type === "plays");
  const sportMovies = filteredMovies.filter((m) => m.type === "sports");
  const activityMovies = filteredMovies.filter((m) => m.type === "activities");

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* NAV + SEARCH */}
      <Header onSearch={setSearchQuery} />

      {/* TIMER CAROUSEL - Microsoft Store Style */}
      <TimerCarousel movies={filteredMovies.length ? filteredMovies : allMovies} />

      {/* POPULAR MOVIES - Microsoft Store Style */}
      <section className="py-8 bg-[#F5F5F5]">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#3E2723] flex items-center gap-2">
              Popular movies
              <ChevronRight size={20} />
            </h2>
          </div>

          {/* Horizontal Scrollable Cards */}
          <div className="relative group">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-4"
            >
              {recommendedMovies.slice(0, 10).map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => window.location.href = `/movie/${movie.id}`}
                  className="flex-none w-[300px] bg-white rounded-lg overflow-hidden shadow-md hover:shadow-md cursor-pointer transform hover:scale-[1.02] transition-all duration-200 snap-start"
                >
                  {/* Badge */}
                  {index < 3 && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-1 bg-[#107C10] text-white text-xs font-semibold rounded">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-[400px] bg-gray-200">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-[#3E2723] mb-1 line-clamp-2 h-10">
                      {movie.title}
                    </h3>
                    <p className="text-sm font-bold text-[#8B5E3C]">
                      {movie.theaters && movie.theaters[0]?.showTimes[0]
                        ? `₹ ${movie.theaters[0].showTimes[0].price}.00`
                        : 'Free'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Arrows */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition -ml-4"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 z-10 opacity-0 group-hover:opacity-100 transition -mr-4"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </div>
        </div>
      </section>

      {/* POPULAR EVENTS - Microsoft Store Style (uses Events API if available) */}
      <section className="py-8 bg-[#F5F5F5]">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#3E2723] flex items-center gap-2">
              Popular events
              <ChevronRight size={20} />
            </h2>
          </div>

          {/* Grid Layout - 2 columns */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {typesData && (
                <select
                  value={selectedTypeId ?? ""}
                  onChange={(e) => setSelectedTypeId(e.target.value ? Number(e.target.value) : null)}
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  <option value="">All types</option>
                  {typesData.data.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(!user ? [] : ((eventsData?.data ?? []).filter(ev => !selectedTypeId || ev.category_id?.id === selectedTypeId))).slice(0, 8).map((event) => {
              const city = event.venue?.city || "";
              const country = event.country_id?.name || "";
              const location =
                city && country ? `${city}, ${country}` : city || country || "Online";

            return (
              <Link
                key={event.id}
                to={generateRoute.eventDetail(event.id)}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
              >
                {/* Event Icon */}
                <div className="flex-none w-20 h-20 bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {event.name.charAt(0)}
                </div>

                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-md text-[#3E2723] truncate mb-1">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1 capitalize line-clamp-1">
                    {location}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {event.start_date} → {event.end_date}
                  </p>
                </div>

                {/* Price (first ticket) */}
                <div className="flex-none text-right">
                  <p className="text-md font-semibold text-[#3E2723]">
                    {event.tickets_type?.[0]
                      ? `₹ ${event.tickets_type[0].price}`
                      : "See details"}
                  </p>
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      </section>

      {/* TRENDING MOVIES - Horizontal Scroll */}
      <section className="py-8 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#3E2723] flex items-center gap-2">
              Trending movies
              <ChevronRight size={20} />
            </h2>
          </div>

          <div
            ref={trendingGamesRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
          >
            {recommendedMovies.slice(0, 8).map((movie) => (
              <div
                key={movie.id}
                onClick={() => window.location.href = `/movie/${movie.id}`}
                className="flex items-center gap-3 flex-none w-[280px] p-3 bg-[#F9F9F9] rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-20 h-20 object-cover rounded flex-none"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-md text-[#3E2723] truncate">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-600">{movie.genre[0]}</p>
                  <p className="text-sm font-semibold text-[#8B5E3C] mt-1">
                    {movie.theaters && movie.theaters[0]?.showTimes[0]
                      ? `₹ ${movie.theaters[0].showTimes[0].price}.00`
                      : 'Free'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING EVENTS - Horizontal Scroll */}
      <section className="py-8 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#3E2723] flex items-center gap-2">
              Trending events
              <ChevronRight size={20} />
            </h2>
          </div>

          <div
            ref={trendingAppsRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
          >
            {allMovies.filter(m => ["5", "6", "9", "10"].includes(m.id)).map((movie) => (
              <div
                key={movie.id}
                onClick={() => window.location.href = `/movie/${movie.id}`}
                className="flex items-center gap-3 flex-none w-[280px] p-3 bg-[#F9F9F9] rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-20 h-20 object-cover rounded flex-none"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-md text-[#3E2723] truncate">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {movie.genre[0] || movie.type}
                  </p>
                  <p className="text-sm font-semibold text-[#8B5E3C] mt-1">
                    {movie.theaters && movie.theaters[0]?.showTimes[0]
                      ? `₹ ${movie.theaters[0].showTimes[0].price}.00`
                      : 'Free'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>







      {/* MUST-WATCH FREE MOVIES - Auto Scroll Horizontal */}
      {/* MUST-WATCH FREE MOVIES - Auto Scroll Horizontal */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#3E2723] flex items-center gap-2">
              Must-watch free movies
              <ChevronRight size={20} />
            </h2>
          </div>

          <div
            ref={mustWatchRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-8 snap-x snap-mandatory px-4"
          >
            {/* Chunk movies into pairs */}
            {(() => {
              const relevantMovies = allMovies.filter(m => ["1", "2", "4", "5", "6", "9", "10", "11", "7", "8", "3", "12", "13", "14", "15"].includes(m.id)).slice(0, 20);
              const pairs = [];
              for (let i = 0; i < relevantMovies.length; i += 2) {
                pairs.push(relevantMovies.slice(i, i + 2));
              }
              return pairs.map((pair, pairIndex) => (
                <div
                  key={pairIndex}
                  className="flex-none w-[300px] flex flex-col gap-3 p-3 rounded border border-gray-100 transition-all duration-300 snap-center"
                >
                  {pair.map((movie, index) => (
                    <div
                      key={movie.id}
                      onClick={() => window.location.href = `/movie/${movie.id}`}
                      className="relative aspect-[3/4] w-full rounded overflow-hidden shadow-md cursor-pointer group"
                    >
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-end justify-between">
                          <div>
                            {pairIndex === 0 && index === 0 && (
                              <span className="inline-block px-1.5 py-0.5 mb-1 bg-[#107C10] text-white text-[8px] font-bold uppercase tracking-wider rounded-full">
                                Featured
                              </span>
                            )}
                            <h3 className="text-sm font-bold text-white mb-0.5 leading-tight line-clamp-1">{movie.title}</h3>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-medium">
                              <span className="px-1 py-0.5 bg-white/20 backdrop-blur rounded text-[8px]">12+</span>
                              <span className="text-[#107C10] font-bold text-[8px]">Free</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* ESSENTIAL EVENTS - Dynamic Section */}
      <section className="py-8 bg-white/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Dynamic Hero Card */}
            <div className={`lg:col-span-8 ${activeEvent.color} rounded-xl p-8 text-white relative overflow-hidden transition-all duration-500 shadow-xl`}>
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[300px]">
                <div>
                  <h2 className="text-4xl font-bold mb-4">{activeEvent.heroTitle}</h2>
                  <p className="text-lg mb-6 opacity-90 max-w-2xl text-[18px]">{activeEvent.heroSubtitle}</p>

                  <button className="px-8 py-3 bg-white text-[#3E2723] font-bold rounded-lg hover:bg-gray-100 transition-all shadow-md">
                    {activeEvent.buttonText}
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  {activeEvent.tags.map((tag, idx) => (
                    <span key={idx} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded text-sm font-medium border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Background Icon/Graphic & Hero Image */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-38 white-overlay">
                <img
                  src={activeEvent.image}
                  alt={activeEvent.heroTitle}
                  className="w-full h-full object-cover mask-image-linear-gradient"
                  style={{ maskImage: 'linear-gradient(to right, transparent, black)' }}
                />
              </div>
              <div className="absolute -bottom-12 -right-12 opacity-10 transform rotate-12 scale-150">
                {/* Can use a larger version of icon or specific graphic */}
                <div className="w-96 h-96 bg-white rounded-full blur-3xl" />
              </div>
            </div>

            {/* Right Column: Category List (Filter) with Checkboxes */}
            <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#3E2723] mb-4 flex items-center gap-2">
                Trending Now
                <ChevronRight className="w-5 h-5" />
              </h3>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                {['all', 'movie', 'event'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize transition-all ${filterType === type
                      ? 'bg-[#3E2723] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {type === 'all' ? 'All' : type + 's'}
                  </button>
                ))}
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {essentialEvents
                  .filter(e => filterType === 'all' || e.category === filterType)
                  .map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setActiveEvent(event)}
                      className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    >
                      {/* Checkbox UI */}
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeEvent.id === event.id
                        ? 'bg-[#E50914] border-[#E50914]'
                        : 'border-gray-300 bg-white'
                        }`}>
                        {activeEvent.id === event.id && (
                          <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                        )}
                      </div>

                      <div className="w-12 h-16 rounded overflow-hidden shadow-sm shrink-0">
                        <img
                          src={event.image}
                          alt={event.listTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h4 className={`font-bold text-sm ${activeEvent.id === event.id ? 'text-black' : 'text-gray-700'}`}>
                          {event.listTitle}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {event.listDesc}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* FEATURED FREE MOVIES - Large Cards */}
      < section className="py-8 bg-gradient-to-br from-[#1a472a] to-[#2d5016] text-white" >
        <div className="container">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Featured free movies</h2>
            <p className="text-white/80">Explore free movies to watch and find a new favorite</p>
          </div>

          <div
            ref={featuredGamesRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
          >
            {allMovies.slice(0, 10).map((movie) => (
              <div
                key={movie.id}
                onClick={() => window.location.href = `/movie/${movie.id}`}
                className="flex-none w-[280px] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
              >
                <div className="relative h-[400px]">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs">12+</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{movie.title}</h3>
                    <p className="text-sm text-white/80">{movie.genre.join(' • ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded transition-all">
            See all
          </button>
        </div>
      </section >

      {/* FOOTER - BookMyShow Style */}
      < footer className="bg-[#333338] text-gray-300" >
        <div className="container py-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 text-xs">

            {/* Column 1 - Movies Now Showing */}
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

            {/* Column 2 - Movies By Genre */}
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

            {/* Column 3 - Movies By Language */}
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

            {/* Column 4 - Movies in Top Cities */}
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

            {/* Column 5 - Help & Support */}
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

          {/* Second Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 text-xs">

            {/* Events */}
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

            {/* Plays */}
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

            {/* Sports */}
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

            {/* Activities */}
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

            {/* Streaming */}
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

          {/* Divider */}
          <div className="border-t border-gray-600 my-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            {/* Copyright */}
            <div className="text-gray-400">
              © 2025 Book&Watch. All Rights Reserved.
            </div>

            {/* Social Media Icons */}
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
      </footer >
    </div >
  );
};

export default Home;