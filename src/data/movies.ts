export type ContentType = 'movies' | 'stream' | 'events' | 'plays' | 'sports' | 'activities';

export interface Movie {
  id: string;
  title: string;
  image: string;
  rating: number;
  votes: string;
  genre: string[];
  description: string;
  duration: string;
  language: string;
  releaseDate: string;
  type: ContentType;
  theaters?: Theater[];
}

export interface ShowTime {
  time: string;
  price: number;
  showId: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  showTimes: ShowTime[];
}

export const movies: Movie[] = [
  {
    id: "1",
    type: "movies",
    title: "Dune: Part Two",
    image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC44LzEwICAxLjZLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00443704-njctmveaay-portrait.jpg",
    rating: 8.8,
    votes: "1.6k+ Votes",
    genre: ["Sci-Fi", "Action", "Thriller"],
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    duration: "2h 46m",
    language: "English",
    releaseDate: "1 Mar, 2024",
    theaters: [
      {
        id: "t1",
        name: "PVR: Phoenix Mall",
        location: "Lower Parel, Mumbai",
        showTimes: [
          { time: "10:30 AM", price: 250, showId: "d2-t1-1030" },
          { time: "2:15 PM", price: 300, showId: "d2-t1-1415" },
          { time: "6:45 PM", price: 350, showId: "d2-t1-1845" },
          { time: "10:30 PM", price: 300, showId: "d2-t1-2230" },
        ],
      },
      {
        id: "t2",
        name: "INOX: Nariman Point",
        location: "Nariman Point, Mumbai",
        showTimes: [
          { time: "11:00 AM", price: 280, showId: "d2-t2-1100" },
          { time: "3:30 PM", price: 320, showId: "d2-t2-1530" },
          { time: "7:00 PM", price: 380, showId: "d2-t2-1900" },
        ],
      },
    ],
  },
  {
    id: "2",
    type: "movies",
    title: "Oppenheimer",
    image: "data:image/jpeg;base64,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",
    rating: 8.9,
    votes: "189.2K",
    genre: ["Biography", "Drama", "History"],
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    duration: "3h 0m",
    language: "English",
    releaseDate: "21 Jul, 2023",
    theaters: [
      {
        id: "t1",
        name: "PVR: Phoenix Mall",
        location: "Lower Parel, Mumbai",
        showTimes: [
          { time: "9:45 AM", price: 230, showId: "op-t1-0945" },
          { time: "1:30 PM", price: 280, showId: "op-t1-1330" },
          { time: "5:15 PM", price: 320, showId: "op-t1-1715" },
        ],
      },
    ],
  },
  // {
  //   id: "3",
  //   type: "stream",
  //   title: "Stranger Things S5",
  //   image: "https://images.unsplash.com/photo-1574267432644-f74f8ec44368?w=300&h=450&fit=crop",
  //   rating: 8.7,
  //   votes: "456.3K",
  //   genre: ["Sci-Fi", "Horror", "Drama"],
  //   description: "The final season of the beloved sci-fi horror series.",
  //   duration: "8 Episodes",
  //   language: "English",
  //   releaseDate: "Coming Soon",
  // },
  {
    id: "4",
    type: "movies",
    title: "The Crown - Final Season",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqartzgwx6bzm_GFVDv_FB182tORUMPOabfw&s",
    rating: 8.4,
    votes: "234.1K",
    genre: ["Drama", "History"],
    description: "The final chapter of the royal saga.",
    duration: "10 Episodes",
    language: "English",
    releaseDate: "16 Nov, 2023",
  },
  {
    id: "5",
    type: "movies",
    title: "Coldplay: Music of the Spheres",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv-S5DxtEmv6yIU5mzqj3whQdbAVc6Q2NURQ&s",
    rating: 9.5,
    votes: "123.4K",
    genre: ["Concert", "Live Music"],
    description: "Experience Coldplay live in an unforgettable concert.",
    duration: "3h 0m",
    language: "English",
    releaseDate: "19 Jan, 2025",
    theaters: [
      {
        id: "e1",
        name: "DY Patil Stadium",
        location: "Navi Mumbai",
        showTimes: [
          { time: "7:00 PM", price: 2500, showId: "cp-e1-1900" },
        ],
      },
    ],
  },
  {
    id: "6",
    type: "movies",
    title: "Diljit Dosanjh Live",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCeROaGxntYy7Z1AbtoWAmnjJ9OaIfx7Ny2JiyNLoy9A&s",
    rating: 9.1,
    votes: "89.2K",
    genre: ["Concert", "Punjabi Music"],
    description: "An electrifying live performance by Diljit Dosanjh.",
    duration: "2h 30m",
    language: "Punjabi/Hindi",
    releaseDate: "10 Feb, 2025",
    theaters: [
      {
        id: "e2",
        name: "Mahalaxmi Race Course",
        location: "Mumbai",
        showTimes: [
          { time: "6:30 PM", price: 1500, showId: "dd-e2-1830" },
        ],
      },
    ],
  },
  {
    id: "7",
    type: "movies",
    title: "The Lion King Musical",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY8-v1uvjrKbAWkcuQZ10YejnMxFoFIDqLjg&s",
    rating: 9.4,
    votes: "67.8K",
    genre: ["Musical", "Family", "Drama"],
    description: "Disney's award-winning musical comes to life on stage.",
    duration: "2h 45m",
    language: "English",
    releaseDate: "15 Dec, 2024",
    theaters: [
      {
        id: "p1",
        name: "NCPA Theatre",
        location: "Nariman Point, Mumbai",
        showTimes: [
          { time: "7:00 PM", price: 1200, showId: "lk-p1-1900" },
          { time: "3:00 PM", price: 1000, showId: "lk-p1-1500" },
        ],
      },
    ],
  },
  {
    id: "8",
    type: "movies",
    title: "Much Ado About Nothing",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjn7fbf1xvQIzcnfGJKk1i6QooaXO8GAz1JA&s",
    rating: 8.6,
    votes: "34.5K",
    genre: ["Comedy", "Romance", "Theatre"],
    description: "Shakespeare's beloved comedy brought to modern stage.",
    duration: "2h 15m",
    language: "English",
    releaseDate: "5 Jan, 2025",
    theaters: [
      {
        id: "p2",
        name: "Prithvi Theatre",
        location: "Juhu, Mumbai",
        showTimes: [
          { time: "8:00 PM", price: 600, showId: "ma-p2-2000" },
        ],
      },
    ],
  },
  {
    id: "9",
    type: "movies",
    title: "IPL 2025: MI vs CSK",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdc4sZ7IWMPOHIIjNDpVx7eZMQCkiRkjAitg&s",
    rating: 9.0,
    votes: "234.2K",
    genre: ["Cricket", "Sports"],
    description: "The epic clash between Mumbai Indians and Chennai Super Kings.",
    duration: "3h 30m",
    language: "Hindi/English",
    releaseDate: "25 Mar, 2025",
    theaters: [
      {
        id: "s1",
        name: "Wankhede Stadium",
        location: "Marine Lines, Mumbai",
        showTimes: [
          { time: "7:30 PM", price: 800, showId: "ipl-s1-1930" },
        ],
      },
    ],
  },
  {
    id: "10",
    type: "movies",
    title: "Indian Super League Final",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkm_ecYXw8ymFovlhNtVjRagaTdGruYX6YdQ&s",
    rating: 8.3,
    votes: "56.7K",
    genre: ["Football", "Sports"],
    description: "The ultimate showdown in Indian football.",
    duration: "2h 0m",
    language: "Hindi/English",
    releaseDate: "20 Feb, 2025",
    theaters: [
      {
        id: "s2",
        name: "DY Patil Stadium",
        location: "Navi Mumbai",
        showTimes: [
          { time: "6:00 PM", price: 500, showId: "isl-s2-1800" },
        ],
      },
    ],
  },
  {
    id: "11",
    type: "movies",
    title: "Escape Room Adventure",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQESNNgblPJ5dApF1ScivbTsfrBqw8E128Ilw&s",
    rating: 8.8,
    votes: "12.3K",
    genre: ["Adventure", "Puzzle", "Team Activity"],
    description: "Test your problem-solving skills in this thrilling escape room experience.",
    duration: "1h 30m",
    language: "English/Hindi",
    releaseDate: "Open Daily",
    theaters: [
      {
        id: "a1",
        name: "Mystery Rooms",
        location: "Andheri, Mumbai",
        showTimes: [
          { time: "11:00 AM", price: 800, showId: "er-a1-1100" },
          { time: "2:00 PM", price: 800, showId: "er-a1-1400" },
          { time: "5:00 PM", price: 900, showId: "er-a1-1700" },
          { time: "8:00 PM", price: 900, showId: "er-a1-2000" },
        ],
      },
    ],
  },
  
];
