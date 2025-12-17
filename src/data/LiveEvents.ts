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

export const LiveEventsData: Movie[] = [
  {
    id: "1",
    type: "events",
    title: "Dune: Part Two",
    image: "https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MzArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/comedy-shows-collection-202211140440.png    ",
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
    image: "https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MyBFdmVudHM%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/theatre-shows-collection-202211140440.png",
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
//   {
//     id: "4",
//     type: "movies",
//     title: "The Crown - Final Season",
//     image: "https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/kids-banner-desktop-collection-202503251132.png",
//     rating: 8.4,
//     votes: "234.1K",
//     genre: ["Drama", "History"],
//     description: "The final chapter of the royal saga.",
//     duration: "10 Episodes",
//     language: "English",
//     releaseDate: "16 Nov, 2023",
//   },
  {
    id: "5",
    type: "movies",
    title: "Coldplay: Music of the Spheres",
    image: "https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/kids-banner-desktop-collection-202503251132.png",
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
    image: "https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTUrIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/music-shows-collection-202211140440.png",
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
    image: "https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-NiBFdmVudHM%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/workshop-and-more-web-collection-202211140440.png",
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
  ];
