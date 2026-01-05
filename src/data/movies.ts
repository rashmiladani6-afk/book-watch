export type ContentType = 'movies' | 'stream' | 'events' | 'plays' | 'sports' | 'activities';

export interface Cast {
  name: string;
  role: string;
  image: string;
}
export interface Crew {
  name: string;
  role: string;
  image: string;
}

export interface Movie {
  id: string;
  title: string;
  image: string;
  background: string;
  rating: number;
  types: string;
  heroPhoto: string;
  trailerUrl?: string;
  votes: string;
  genre: string[];
  description: string;
  duration: string;
  language: string;
  releaseDate: string;
  type: ContentType;
  theaters?: Theater[];
  cast?: Cast[];
  crew?: Crew[];
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
    background: "",
    heroPhoto: "",
    rating: 8.8,
    types: "2D",
    trailerUrl: "",
    votes: "1.6k+ Votes",
    genre: ["Sci-Fi", "Action", "Thriller"],
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    duration: "2h 46m",
    language: "English",
    releaseDate: "1 Mar, 2024",
    cast: [
      {
        name: "Timothée Chalamet",
        role: "Paul Atreides",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Timoth%C3%A9e_Chalamet_2022.jpg/220px-Timoth%C3%A9e_Chalamet_2022.jpg"
      },
      {
        name: "Zendaya",
        role: "Chani",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg/220px-Zendaya_-_2019_by_Glenn_Francis.jpg"
      },
      {
        name: "Rebecca Ferguson",
        role: "Lady Jessica",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Rebecca_Ferguson_by_Gage_Skidmore.jpg/220px-Rebecca_Ferguson_by_Gage_Skidmore.jpg"
      },
      {
        name: "Austin Butler",
        role: "Feyd-Rautha",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Austin_Butler_2022.jpg/220px-Austin_Butler_2022.jpg"
      }
    ],
    crew: [
      {
        name: "Jay Bodas",
        role: "Director",
        image: 'https://in.bookmyshow.com/movies/surat/chaniya-toli/ET00451887#'
      }
    ],
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
    image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS4xLzEwICAyMC4ySysgVm90ZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00441877-evffgmxdme-portrait.jpg",
    background: "",
    heroPhoto: "",
    rating: 8.9,
    types: "",
    votes: "189.2K",
    genre: ["Biography", "Drama", "History"],
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    duration: "3h 0m",
    language: "English",
    releaseDate: "21 Jul, 2023",
    cast: [
      {
        name: "Cillian Murphy",
        role: "J. Robert Oppenheimer",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Cillian_Murphy_2023.jpg/220px-Cillian_Murphy_2023.jpg"
      },
      {
        name: "Robert Downey Jr.",
        role: "Lewis Strauss",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/220px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg"
      },
      {
        name: "Emily Blunt",
        role: "Kitty Oppenheimer",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Emily_Blunt_SAG_Awards_2019.png/220px-Emily_Blunt_SAG_Awards_2019.png"
      },
      {
        name: "Matt Damon",
        role: "Leslie Groves",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Matt_Damon_TIFF_2015.jpg/220px-Matt_Damon_TIFF_2015.jpg"
      }
    ],
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
  {
    id: "4",
    type: "movies",
    title: "The Crown - Final Season",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqartzgwx6bzm_GFVDv_FB182tORUMPOabfw&s",
    background: "",
    heroPhoto: "",
    rating: 8.4,
    types: "",
    votes: "234.1K",
    genre: ["Drama", "History"],
    description: "The final chapter of the royal saga.",
    duration: "10 Episodes",
    language: "English",
    releaseDate: "16 Nov, 2023",
    cast: [
      {
        name: "Imelda Staunton",
        role: "Queen Elizabeth II",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Imelda_Staunton_%28cropped%29.jpg/220px-Imelda_Staunton_%28cropped%29.jpg"
      },
      {
        name: "Jonathan Pryce",
        role: "Prince Philip",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Jonathan_Pryce_by_Gage_Skidmore.jpg/220px-Jonathan_Pryce_by_Gage_Skidmore.jpg"
      },
      {
        name: "Lesley Manville",
        role: "Princess Margaret",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Lesley_Manville_at_the_2018_Berlin_Film_Festival.jpg/220px-Lesley_Manville_at_the_2018_Berlin_Film_Festival.jpg"
      },
      {
        name: "Dominic West",
        role: "Prince Charles",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Dominic_West_in_2016.jpg/220px-Dominic_West_in_2016.jpg"
      }
    ],
  },
  {
    id: "5",
    type: "movies",
    title: "Coldplay: Music of the Spheres",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv-S5DxtEmv6yIU5mzqj3whQdbAVc6Q2NURQ&s",
    background: "",
    heroPhoto: "",
    rating: 9.5,
    types: "",
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
    background: "",
    heroPhoto: "",
    rating: 9.1,
    types: "",
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
    title: "Chaniya Toli",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY8-v1uvjrKbAWkcuQZ10YejnMxFoFIDqLjg&s",
    background: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/listing/medium/chaniya-toli-et00451887-1757313632.jpg",
    heroPhoto: "",
    trailerUrl: "https://www.youtube.com/watch?v=NjvD-qZh9jM",
    rating: 9.4,
    types: "2D",
    votes: "67.8K",
    genre: ["Musical", "Family", "Drama"],
    description: "'Chaniya Toli' refers to a popular 2025 Gujarati film about an ordinary teacher who, seeing his village's financial ruin from corruption, plots a heist to 'rob the system' back for the poor, blending action, comedy, and social commentary with a focus on local women taking charge, inspired by the traditional Chaniya Choli attire.",
    duration: "2h 45m",
    language: "English",
    releaseDate: "15 Dec, 2024",
    cast: [
      {
        name: "Yash Soni",
        role: "Prkash Mistry",
        image: "data:image/jpeg;base64,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"
      },
      {
        name: "Heena Varde",
        role: "",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHgAeAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAGBwQFAAIDCAH/xAA/EAACAQMCAwUFBQUGBwAAAAABAgMABBEFIQYSMRMiQVFhBzJxgZEUIzOxwRVCUmLRFkNyofDxRHOCkqKzwv/EABoBAQADAQEBAAAAAAAAAAAAAAUDBAYCAQD/xAAqEQACAgIABQMEAgMAAAAAAAABAgADBBEFEiExQRMiURQyYXEGIxVCof/aAAwDAQACEQMRAD8ATGCDU7QwX1zTUB967iH/AJiuk9njwrrw9ARxJpO3/HQf+xanyMflUmfU3ByNT0LF3TnzNWEZ+7X4VAA3FTk/DT4VnuB9b2P4iHFz/UP3N61JzvXw1S8S8SWPD9r2t1KOcjuRA95z6VqDoDZmfG2OhLK7mSMd9gNs1QanxFY2cEjiVZJEGRGGA5qV+vcbarqbs4JhgzsiHH1PWhmTULiZ+85BPmc1n8zCXIvNhPSP4tppqCeY3IePbSQDm0+65j1VGQkfLIqW/GukRKGuGmiJ/dZASPkCaS63UoYYchh0I6irC2ma6PJO/e8H6jPqKrtwun4lkZTRtRca8PS9NSjT/GrL+YqbDxDo0+8eq2ZH/NApLHT+V+V05SD+6ciruw0zhp7aKPU01GO673aSQ8pT3jjA6+7j51aq/j6XDaMZXv4r6H3CNxbm2lXMU8Tj+VwazIPSlLNwxw9KWNprstuVOwntCcjHmCKGFuby2YpHd3C8pwCsjD9a4u/jz1/7f8nWPxiq7sJ6AzispEw8Ra3B+Hql183z+dZVX/C3+GEt/X1/EtJbUnwrfh+zJ4m0kEbC8jb6MD+lXEllKBkxmu3D1sf7SablTtOD9Aa2OaR6Tn8GZPDDB1/cZ+NxUsHCgeQrmE71dX7oz6VlOAjdr/qNcXb+tRK/W9Xt9G02e+uT3IlyF8WPgB8a89a9rl5q9893dy80rHwOyjyFHXtd1hpLuDS4SeVFEj+WTnFLizt/tF4sfXJprJs668CVMOnS83kzZIpZwrYYt5mrG00Oa5k7/MB54o00zSYY0XCLt6VdRWIxsNvShnzT2WO14Q1toubjhuRD9255j4sKgNa3NkzCVCQu+RTWbTx4iqXXdLH2Z3UAsB0rmvMJOmnr4Y1tYHWeoHtimO4dzH4A0W6PYx3Vrz43QlSG6rQJ+FM7HqKtNL1O5tzIsM7IZlw565A/1in+HZf09uz2Mz/E8RsmnlQ6YQz/AGXE/MVAceYGapde4bMkbS2y4lG4XGOb0o69k1guqaNcT3QLSdscZ8skfpXO+ubX+1d9oMi9nLGQYjn3wVDf1rQHKpv3WwmSKZmK5sQ7AMTTRFSVIIIOCDWUyuI+FkuOaWICOcDOcbN8a+1TbCbft6iN0cax3TbnRh4mgEoMMp2qLFo722s2DFU3kOP+01wTWZoCUbmDDYg7EVppmrSXvE1ghYkIXO5/lNE5VNvpsSemjFarqzrXeG8dkeXPJvVdeuI+fmyFU74+NXsF1tynFBfFuopZWt3O3uRqWPqc4A+tHcJStOZlPic5xd+UGI/i+9a/169uW25pGAGegBwK48KWxlvjcEghe6PjUXUHaRpJG95skkVP4aiuDAzx3Mduik99hnmru5iUJ+YhSoV1HxGRZISi1aRrypjG9BVhqN9DMEa9hmQ+PJg0X2FwLiEyZ2FB2IUMbrcNJLRS46VCuISwKsM7dMUP65c3QkLSahJFFk92Lqaj2CWc5Bj1G6Mvm0gwKkWva7nBt661BTinTn0/UmGMRvuKgWk3Zyo/ipB+Io24ssZLzTGZyrTwd4ONuceVL6ByJAree1LYr86fqFZK8ln7noj2TQNbXGr26sTApiaLP8LBm/WgL2qpNa+0S4ureTs5EWKRWHgQKZ/suiReHbS7UHNzaxKzAZ7ycy7/AEoV9q2hu+uJeIMCZBknzG1LK4NhO/EGFfj5MuvtUWs8Iw61Cih1TMqjwI2cfnWVQ8GObDhrXrB3HI0ZliHqQFP/AM19pHFu9pgWXwpWtJ5Zd8faLcjUXv8ATYxNEyc1zErDKEfvY9RiqDg1RLxLbkZwFfII3Hd8acDWcJeWTkHaSLysx8sYx8KqTw7Zx6vFqMC9ncdmUkx0ccuMn16b0TZeWoas/EfWvVgaanu58MbnNKP2n6sN7BG3dxJJg9APdH13pvari0tJJ5RyxopZz6CvNvE9497qFxcSHeSRmA8lzsPpQ+GDWHX5iLqLGVviVU33kRI8auND0qa80+3aN8DJLbdd6pID3OU+dMHgeJV02Px3Ir3Kc119Jbx0FlnWQ7bh14Mszty+fLjFEWjxslqy5PL51vqcwf7uPlC5wWJqdYxBbTGVznz8KLe1rB1iVdSoekpdS0U3Q7RHIbBUjbbPxFQrThdFZWft+YEYPMB0+G/jRO7MuycjjHMcGpdvJDNDkGvlvcDlE9NKE71B3VbblsZB5KRSjKsl0AR406uIUP7NkdNyRhQPEmlHcQn9o9kf7vZiKR4c29w/PXqI9/Z9eCL2fQM0nJ2TsmRnfvE/rVfxJxTH2KW06u1wrYKSr7vyODnp9auPZTax3fBb28gU5lY4Izihv2h8LyW/YzJDgdszvIu2SQOvrsKeqRLFKnvAWtau3t03KWHURcLIEGG36dB/rFZUO2spIVZYwTzjIrKVqqVEC6lWywu5bcbzcaIy/ghQNyQ3X0HrUrh7XodU1JoYy/MsZbDAbDageyv4L2ARKoVuUtjHj8/nVn7Pl7LiO6LbFbQnGf5lqvkYdSVM46EQ3C4pdbeKnHeWXtO1WOPTTpqSYaVS8uAdkXf/AD6fOvPl8/ayMce+Tt6U0/aJqPbQahccysZ5Fgg23CKTzH5kD6UqQwLNnwO1Z4dWJmuUaTUjhcNj1FGfB0rmB4kfBGcCg5wTIAOud/SrLQtT+wXcQJwrMckeB6/qajyay6aEmx3CNswuvLk/ao7Ts3Z5NlxtknwqysrHVOURdhcCM+HJmoFwUvWSQdchgw6g+Yq+tbzUxGEF4+PU70SdARUbPac7ky6VB2lzayIi/Df5ZrnZvLLP2ixvCrrzFX6/SpT2vOyvM7SuOnMSa2nlSFS+cY61wda6Tv3eZH1WVVgiWYoEeVVYucBRnrSy1BEXVp+zII5x7vQelTuKNYluZ0WQsI3mDKin+7Q4wfi2T/0iqy1HMyk/xDIpfFp9JNnzCci71H0PEc3svmvxos4tzEIomLYIPMTgEb56bGjniCwfXbBrOFxGrqrNIy5wcgjFLv2VSXL3EtlBnsnTMrHoo3H13ptBVt4Uij6KoUClQ2gpHeC2r/Y2+089a/LJoWqXGn3QPPERuDkEeH1rKl+1mCNNeVFy1w/NJIT4g7CspF2I1oyDGItr5jBTS9Ve2m5ySSR59aZXCV+rPfX0ec/YzljtnBBpX2VvDy5kO9HnChVtJvhGfxIlhx5878tUcjNP0zp+JNXgL9SlnmVvHZ7KGxtx1hgHaY/iO5oFJKcxHU+NGXtEkxqgjz7qg0Hy8vICOhWiKOqAxmz7tTWKMDAHU7D9TVZcTN9pdkJBBOMeXSrVWCqZPIVTdTk9TVmvvKtvYCGnDF7JDbxCYlkxs3lR9ZyRvGChBoD4eh57KMEHBXwGaI9Pg5WwDkelD5ABcxnHJCCEEt0g2QZb0qBdIzxs7/SpkEA2G+K4a0xhsnaMZYDb41WX7pYPaKO+dm1O4UnKpIeUeWf9hUux6Z/mrleWM8NzJJKMl+9sMVvZ7d09c1oNgoNQMDlc7jp9j86KsyHHM45h8sf1pkXcojiaTBZv3V8z5Um/ZReCLUHjJHNycyAnb1pma5rNrp+lzapcyD7PAmVH8Rq8oDBSIJlOUsdT3id9rThdWiR2DXLAs59D4V9oR1vUptX1Ke/ufxJmJx/CPACvlXLG2Z7iVmqoKZf8R6TFprJ2Tc3MM1ZcCMXW9Xcjt7UD5OTQ/fT3eo3MNvGWlmkPKi7kk0ecJ6Kui2olurlZZ5mMjxIuBHyZXDHzz+W1Z24N6JUnrHUK+pvxATjy47biC4wfcHLv5gD9aGwT2SDzqy4muVutcv5k9wyEL9cVVBwBucEdDUlSctYE5dtsTPty4WPsweg3+NQQK3lYnOetfYxzMB03qcDQkJ6mMDhVQLaLai2O1UkMBvVHoGmyppVtdxjuEhXXGOU4G/wO9E8AKphuuKByPvMco+wTtGoVMnwqBfxdrGw9KmvkRmoxWe5dLeBPvJDgZPTzJ9KiQdZM3QSHpmgW2qQXkskZckdii46HqT+VBN7w1fWk0hjjLoHwpFOxIYNL0f7PAWKxocsBgsfE/Go8enA2KJKo5iOZsDxNIVWFYW+nO4qtAS+s7iObsZEcHu7bHzHwrf2h6hq932CXUNxDY7FQVIRm8Mnpmmbb2UaHspI12PdIFW0McUsDW1zEk0TjldJFDKw9Qau0Z7V+3xKeRg1WOLCPcJ5qA8ugrKb/ABb7MLW4he64b+5nUZNozfdv/hz7p/y+FZSS5VTDe5V9FpacHcMxcP2h1HUFX9oOhzzdIF8h6+ZoI4p1uSCe7ayPKt3klcfh/wAw9fyJ884ysoUe5+sRUaWAMq9oSFAC58PGuLIF+PjWVlXZBIkneOR0rvbRNJNGie8zACsrK+PaeDvPQ/DFpCmi20IHMhjwwPjnfetdQ09rRjImXhJ6jqvx/rWVlC2DZ6xJGKnpIZccypGvPIfdQdTV9o+nNaqZGUGdx3mxso8hWVlcooneRYdaki7UzTpbHoBzMT4jyqYV23r5WVYEqbmjovKdq5qMEYrKyvp0DJkbHl64rKysrsSMgbn/2Q==",
      },
      {
        name: "Netri Trivedi",
        role: "Naina",
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Chetan Dahiya",
        role: "MLA",
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Ragi Jani",
        role: "Peshawar",
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Maulik Nayak",
        role: "Repoter",
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Kalpana",
        role: "Gagdeker",
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Soli Bhatt",
        role: "Modasa",
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Jay Bhatt",
        role: "PI Zala",
        image: "data:image/jpeg;base64,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",
      },
      {
        name: "Nikita Sharma",
        role: "Sheetal",
        image: "",
      },
    ],
     crew: [
      {
        name: "Jay Bodas",
        role: "Director",
        image: ''
      },
       {
        name: "Parth Trivedi",
        role: "Director",
        image: ''
      },
       {
        name: "Anand Pandit",
        role: "Director",
        image: ''
      },
       {
        name: "Vishal Shah",
        role: "Producer",
        image: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/vaishal-shah-1082797-1759757713.jpg'
      },
       {
        name: "Ankit Trivedi",
        role: "	Cinematographer",
        image: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/ankit-trivedi-9196-13-12-2018-12-13-27.jpg'
      },
       {
        name: "Nirav Panchal",
        role: "Editor",
        image: 'https://in.bmscdn.com/iedb/artist/images/website/poster/large/nirav-panchal-1075636-16-05-2017-17-12-34.jpg'
      },
    ],
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
    background: "",
    heroPhoto: "",
    rating: 8.6,
    types: "",
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
    background: "",
    heroPhoto: "",
    rating: 9.0,
    types: "",
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
    background: "",
    heroPhoto: "",
    rating: 8.3,
    types: "",
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
    background: "",
    heroPhoto: "",
    rating: 8.8,
    types: "",
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