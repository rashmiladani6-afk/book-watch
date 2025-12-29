import { useState, useRef, useEffect } from "react";
import { movies as allMovies, ContentType } from "@/data/movies";

import MovieCard from "@/components/MovieCard";
import LiveEvents from "@/components/LiveEvents";
import Premiere from "@/components/Premiere";
import { Premeiere } from "@/data/Premiere";

import { musicStudioData } from "@/data/MusicStudio";
import { LaughterTherapData } from "@/data/LaughterTherapy"
import { LiveEventsData } from "@/data/LiveEvents";
import { PopularEventsData } from "@/data/PopularEvents";
import { LatestPlaysData } from "@/data/LatestPlays"
import { TopGames_SportsEventsData } from "@/data/TopGames_SportsEvents"
import { FunACtivitiesData } from "@/data/FunActivities"
 
import Header from "@/components/Header";
import TimerCarousel from "@/components/TimerCarousel";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

import playButton from "../assest/image/play button/Watch new moives at home, ever Friday (3).png";

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
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const trendingGamesRef = useRef<HTMLDivElement>(null);
  const trendingAppsRef = useRef<HTMLDivElement>(null);
  const featuredGamesRef = useRef<HTMLDivElement>(null);

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
  useEffect(() => {
    const interval = setInterval(() => {
      if (trendingAppsRef.current) {
        const maxScroll = trendingAppsRef.current.scrollWidth - trendingAppsRef.current.clientWidth;
        const currentScroll = trendingAppsRef.current.scrollLeft;
        
        if (currentScroll >= maxScroll) {
          trendingAppsRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          trendingAppsRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
  
  // ADD FOOTER STATE HERE
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

      {/* POPULAR EVENTS - Microsoft Store Style */}
      <section className="py-8 bg-[#F5F5F5]">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#3E2723] flex items-center gap-2">
              Popular events
              <ChevronRight size={20} />
            </h2>
          </div>

          {/* Grid Layout - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allMovies.filter(m => ["5", "6", "9", "10", "7", "8", "4", "11"].includes(m.id)).slice(0, 8).map((movie) => (
              <div
                key={movie.id}
                onClick={() => window.location.href = `/movie/${movie.id}`}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              >
                {/* Event Icon */}
                <div className="flex-none w-20 h-20 bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {movie.title.charAt(0)}
                </div>

                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-md text-[#3E2723] truncate mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1 capitalize">
                    {movie.type === 'movies' ? movie.genre[0] : movie.type}
                  </p>
                </div>

                {/* Price */}
                <div className="flex-none text-right">
                  <p className="text-md font-semibold text-[#3E2723]">
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







      {/* MUST-WATCH FREE MOVIES - Grid Layout */}
      <section className="py-8 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#3E2723] flex items-center gap-2">
              Must-watch free movies
              <ChevronRight size={20} />
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allMovies.filter(m => ["1", "2", "4", "5", "6", "9", "10", "11"].includes(m.id)).slice(0, 8).map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => window.location.href = `/movie/${movie.id}`}
                className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transform hover:scale-[1.02] transition-all duration-200 group"
              >
                {index === 0 ? (
                  // Large featured card (first item)
                  <div className="relative h-[400px] bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="text-2xl font-bold text-white mb-2">{movie.title}</h3>
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{movie.description}</p>
                      <button className="w-fit px-6 py-2 bg-[#DC3545] hover:bg-[#c82333] text-white rounded transition-all">
                        Get
                      </button>
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                        <span className="px-2 py-1 bg-black/30 rounded">12+</span>
                        <span>{movie.genre.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular movie cards
                  <div className="relative h-[200px]">
                    {index < 4 && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-1 bg-[#107C10] text-white text-xs font-semibold rounded">
                          Featured
                        </span>
                      </div>
                    )}
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-semibold text-sm mb-1">{movie.title}</h3>
                      <p className="text-white/80 text-xs">{movie.genre[0]}</p>
                      <p className="text-white text-xs font-semibold mt-1">Free</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMOTIONAL BANNER - LinkedIn Style */}
      <section className="py-8 bg-[#F5F5F5]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large promotional banner */}
            <div className="lg:col-span-2 bg-gradient-to-r from-[#0077B5] to-[#00A0DC] rounded-xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4">Find your next opportunity</h2>
                <p className="text-lg mb-6 opacity-90">Your next opportunity could be one click away. Find your dream job today.</p>
                <button className="px-8 py-3 bg-white text-[#0077B5] font-semibold rounded-lg hover:bg-gray-100 transition-all">
                  Get started
                </button>
                <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
                  <span className="px-2 py-1 bg-white/20 rounded">12+</span>
                  <span>Professional Networking</span>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 opacity-20">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
            </div>

            {/* Essential events sidebar */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#3E2723] mb-4 flex items-center gap-2">
                Essential events
                <ChevronRight size={18} />
              </h3>
              <p className="text-sm text-gray-600 mb-6">Take your experience to new heights with these must-see events</p>
              
              <div className="space-y-3">
                {allMovies.slice(0, 8).map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => window.location.href = `/movie/${movie.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-all"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] rounded flex items-center justify-center text-white font-bold flex-none">
                      {movie.title.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#3E2723] truncate">{movie.title}</h4>
                      <p className="text-xs text-gray-600 capitalize">{movie.genre[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED FREE MOVIES - Large Cards */}
      <section className="py-8 bg-gradient-to-br from-[#1a472a] to-[#2d5016] text-white">
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
      </section>

      {/* FOOTER - BookMyShow Style */}
      <footer className="bg-[#333338] text-gray-300">
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
      </footer>
    </div>
  );
};

export default Home;