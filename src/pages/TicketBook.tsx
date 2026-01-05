import { Link, useParams } from "react-router-dom"
import { movies } from "@/data/movies"
import { useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import Header from "@/components/Header"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const TicketBook = () => {
  const { id } = useParams()
  const [activeDay, setActiveDay] = useState(0)
  
  // Only one dropdown open at a time
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState("relevance")


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

  const movie = movies.find(m => String(m.id) === id)
  if (!movie) return <div className="p-10 text-center">Movie not found</div>

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName)
  }

  const priceRanges = [
    "₹0 - ₹100",
    "₹101 - ₹200",
    "₹201 - ₹300",
    "₹301 - ₹400",
    "₹401 - ₹500",
    "₹501 - ₹600",
    "₹601 - ₹700",
    "₹701 - ₹900"
  ]

  const formats = ["Dolby", "Dolby Atmos", "Insignia", "P [XL]"]
  
  const times = [
    { label: "Morning", time: "12:00 AM - 11:59 AM", icon: "🌅" },
    { label: "Afternoon", time: "12:00 PM - 3:59 PM", icon: "☀️" },
    { label: "Evening", time: "4:00 PM - 6:59 PM", icon: "🌆" },
    { label: "Night", time: "7:00 PM - 11:59 PM", icon: "🌙" }
  ]

  const sortOptions = [
    { value: "relevance", label: "Relevance", desc: "Best options for you first" },
    { value: "popularity", label: "Popularity", desc: "Show most popular first" },
    { value: "distance", label: "Distance", desc: "Show nearest first" }
  ]

  // Seat types data for tooltip
  const seatTypes = [
    { name: "RECLINER", price: 570, available: true },
    { name: "EXECUTIVE", price: 330, available: true },
    { name: "ROYAL", price: 330, available: true },
    { name: "MARVEL", price: 290, available: true }
  ]

  return (
    <div>
    <div className="max-w-7xl mx-auto px-4">

    <Header/>

      {/* 🎬 Movie Title */}
      <div className="py-6 border-b">
        <h1 className="text-3xl font-bold">{movie.title} - (Hindi)</h1>
        <div className="flex gap-2 mt-3 text-sm text-gray-600 flex-wrap">
          <span className="border px-2 py-1 rounded">3h 30m</span>
          <span className="border px-2 py-1 rounded">A</span>
          <span className="border px-2 py-1 rounded">Action</span>
          <span className="border px-2 py-1 rounded">Thriller</span>
        </div>
      </div>

      {/* 📅 Date Row */}
      <div className="flex gap-3 py-4 overflow-x-auto">
        {days.map((day, i) => (
          <button
            key={i}
            onClick={() => setActiveDay(i)}
            className={`min-w-[70px] rounded-lg text-center py-2 border
              ${activeDay === i
                ? "bg-red-500 text-white"
                : "bg-white hover:bg-gray-100"
              }`}
          >
            <div className="text-xs">{day}</div>
            <div className="font-semibold">{String(4 + i).padStart(2, "0")} JAN</div>
          </button>
        ))}
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex gap-6">
        {/* Left Side - Theaters */}
        <div className="flex-1">
          {/* 🎛 Quick Filters */}
          <div className="flex gap-4 py-3 border-y text-sm text-gray-700 mb-4">
            <button className="border px-3 py-1 rounded">Hindi · 2D</button>
          </div>

          {/* 🏢 Theaters */}
          <div className="divide-y">
            {movie.theaters?.map(theater => (
              <div key={theater.id} className="py-6 flex gap-6">
                {/* Theater Info */}
                <div className="w-[35%]">
                  <h3 className="font-semibold text-lg">{theater.name}</h3>
                  <p className="text-sm text-gray-500">{theater.location}</p>
                  <p className="text-xs text-gray-400 mt-3">Non‑cancellable</p>
                </div>

                {/* Show Times */}
                <div className="flex flex-wrap gap-3">
                  {theater.showTimes.map(show => (
                    <div key={show.showId} className="relative group">
                      <Link to={`/book/${show.showId}`}>
                        <button className="min-w-[96px] text-sm font-medium border border-green-500 text-green-600 py-2 px-4 rounded hover:bg-green-50">
                          {show.time}
                        </button>
                      </Link>

                      {/* Tooltip - Shows on hover - HORIZONTAL LAYOUT */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[290px]">
                          {/* Seat Types - HORIZONTAL GRID */}
                          <div className="grid grid-cols-4 gap-3 mb-3">
                            {seatTypes.map((seat, idx) => (
                              <div key={idx} className="text-center">
                                <div className="font-semibold text-sm text-gray-800">₹{seat.price}.00</div>
                                <div className="text-xs text-gray-600 mt-1">{seat.name}</div>
                                <div className="text-xs text-green-600 font-medium mt-1">
                                  Available
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Non-cancellable info */}
                          <p className="text-xs text-gray-500 text-center">Non-cancellable</p>

                          {/* Arrow pointer */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px]">
                            <div className="w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Filters */}
        <div className="w-64 space-y-2">
          {/* Price Range Filter */}
          <div className="border rounded">
            <button
              onClick={() => toggleFilter('price')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium">Price Range</span>
              {openFilter === 'price' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openFilter === 'price' && (
              <div className="px-4 py-3 border-t max-h-64 overflow-y-auto">
                {priceRanges.map(range => (
                  <label key={range} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50">
                    <span className="text-sm">{range}</span>
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(range)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPrices([...selectedPrices, range])
                        } else {
                          setSelectedPrices(selectedPrices.filter(p => p !== range))
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Special Formats Filter */}
          <div className="border rounded">
            <button
              onClick={() => toggleFilter('format')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium">Special Formats</span>
              {openFilter === 'format' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openFilter === 'format' && (
              <div className="px-4 py-3 border-t">
                {formats.map(format => (
                  <label key={format} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50">
                    <span className="text-sm">{format}</span>
                    <input
                      type="checkbox"
                      checked={selectedFormats.includes(format)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFormats([...selectedFormats, format])
                        } else {
                          setSelectedFormats(selectedFormats.filter(f => f !== format))
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Time Filter */}
          <div className="border rounded">
            <button
              onClick={() => toggleFilter('time')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium">Preferred Time</span>
              {openFilter === 'time' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openFilter === 'time' && (
              <div className="px-4 py-3 border-t">
                {times.map(timeSlot => (
                  <label key={timeSlot.label} className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{timeSlot.icon}</span>
                        <span className="text-sm font-medium">{timeSlot.label}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-7">{timeSlot.time}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTimes.includes(timeSlot.label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTimes([...selectedTimes, timeSlot.label])
                        } else {
                          setSelectedTimes(selectedTimes.filter(t => t !== timeSlot.label))
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Sort By Filter */}
          <div className="border rounded">
            <button
              onClick={() => toggleFilter('sort')}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
            >
              <span className="font-medium">Sort By</span>
              <Search className="w-4 h-4" />
            </button>
            {openFilter === 'sort' && (
              <div className="px-4 py-3 border-t">
                {sortOptions.map(option => (
                  <label key={option.value} className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.desc}</div>
                    </div>
                    <input
                      type="radio"
                      name="sort"
                      checked={selectedSort === option.value}
                      onChange={() => setSelectedSort(option.value)}
                      className="w-4 h-4"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      


      
    </div>

    <div className="mt-40">

    
  <footer className="bg-[#333338] text-gray-300" >
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
    </div>
    </div>
  )
  
}


export default TicketBook