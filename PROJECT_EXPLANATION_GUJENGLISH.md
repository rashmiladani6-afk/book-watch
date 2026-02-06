# Matinee Map Project - Full Step by Step Explanation (Gujenglish)

## 🎬 Project Overview

Ae project ek **Movie/Event Booking System** chhe, jene **BookMyShow** jovi functionality chhe. User ekthi movies, events, plays, sports, activities nu booking karvi shake chhe. Project React + TypeScript ma banavyu chhe ane Supabase backend use kare chhe.

---

## 📁 Project Structure Explanation (Top Level)

### 1. **Main Entry Point Files**

#### `main.tsx` - Application Start Kare
```typescript
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
```
- Aa file application nu **starting point** chhe
- `createRoot` thi React app DOM ma mount thay chhe
- `app/App.tsx` main App component load thay chhe
- Global CSS `src/styles/index.css` thi apply thay chhe

---

### 2. **`src/app` Folder - Shell & Routing**

Aa folder ma tamaru **application nu main shell** chhe.

- `app/App.tsx`
  - Aa main layout chhe:
  - `<Providers>` wrap kare chhe (React Query, Router, Auth, Toasts)
  - Left side ma `VerticalSidebar`
  - Right side ma `<AppRoutes />` (badha pages na routes)
- `app/providers.tsx`
  - `QueryClientProvider` (TanStack Query)
  - `BrowserRouter`
  - `AuthProvider`
  - `TooltipProvider`, `Toaster`, `Sonner`
- `app/routes.tsx`
  - Badha routes ek jagya par define:
    - `/` → `features/movies/pages/Home`
    - `/movie/:id` → `features/movies/pages/MovieDetail`
    - `/ticket/:id` → `features/booking/pages/TicketBook`
    - `/book/:showId` → `features/booking/pages/SeatSelection`
    - `/payment` → `features/booking/pages/Payment`
    - `*` → `pages/NotFound`

---

### 2. **App.tsx - Main Application Component**

```typescript
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/book/:showId" element={<SeatSelection />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

**Kya kare chhe:**
- **QueryClientProvider**: TanStack Query (React Query) provide kare chhe data fetching mate
- **BrowserRouter**: URL routing handle kare chhe
- **AuthProvider**: User authentication state manage kare chhe
- **Routes**: Different pages nu routing define kare chhe:
  - `/` → Home page (movies list)
  - `/movie/:id` → Movie detail page
  - `/book/:showId` → Seat selection page
  - `/auth` → Login/Signup page
  - `/payment` → Payment page
  - `*` → 404 Not Found page

---

### 3. **Feature Folders - Movies & Booking**

#### **`features/movies/pages/Home.tsx`** - Main Landing Page
```typescript
const [selectedCategory, setSelectedCategory] = useState<ContentType | 'all'>('all');
const [searchQuery, setSearchQuery] = useState('');
```

**Kya kare chhe:**
1. **Hero Banner**: Welcome message ane attractive banner show kare chhe
2. **Category Filter**: Movies, Stream, Events, Plays, Sports, Activities filter karva mate buttons
3. **Search Functionality**: Movie title ya genre thi search karva
4. **Movie Grid**: Filtered movies nu grid layout ma display kare chhe
5. **Footer**: Links ane information show kare chhe

**Working Flow:**
- User category select kare → `selectedCategory` update thay
- User search kare → `searchQuery` update thay
- Movies filter thay ane grid ma show thay

---

#### **Auth.tsx** - Login/Signup Page
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [fullName, setFullName] = useState('');
```

**Kya kare chhe:**
1. **Two Tabs**: Sign In ane Sign Up tabs
2. **Form Validation**: Zod library use kare chhe validation mate
   - Email format check
   - Password minimum 6 characters
   - Full name required for signup
3. **Supabase Authentication**:
   - **Sign Up**: `supabase.auth.signUp()` call kare chhe
   - **Sign In**: `supabase.auth.signInWithPassword()` call kare chhe
4. **Success/Error Handling**: Toast notifications show kare chhe

**Working Flow:**
- User sign up kare → Account create thay → Auto login → Home page par jay
- User sign in kare → Session create thay → Home page par jay

---

#### **`features/movies/pages/MovieDetail.tsx`** - Movie Details Page
```typescript
const { id } = useParams();
const movie = movies.find((m) => m.id === id);
```

**Kya kare chhe:**
1. **Movie Banner**: Large banner image show kare chhe
2. **Movie Info**: 
   - Title, Rating, Votes
   - Genre badges
   - Duration, Language, Release Date
   - Description
3. **Theater List**: Different theaters nu list show kare chhe
4. **Show Times**: Each theater ma available show times ane prices
5. **Book Button**: Each show time par book button, click kari ne seat selection par jai

**Working Flow:**
- URL ma movie ID parse kare → Movie data find kare → Display kare
- Show time select kare → `/book/:showId` route par navigate thay

---

#### **`features/booking/pages/SeatSelection.tsx`** - Seat Booking Page
```typescript
type SeatStatus = "available" | "selected" | "booked";
interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: "regular" | "premium";
}
```

**Kya kare chhe:**
1. **Authentication Check**: User login nathi to auth page par redirect kare
2. **Seat Layout**: 
   - 10 rows (A to J)
   - 12 seats per row
   - Screen indicator show kare chhe
3. **Seat Types**:
   - **Regular**: Normal price
   - **Premium**: 1.5x price (Rows A-B)
4. **Seat Selection**: Click kari ne seat select/deselect karva
5. **Booking Summary**: 
   - Selected seats list
   - Total amount calculation
   - Convenience fee add (₹30 per ticket)
6. **Proceed to Pay**: Button click kari ne payment page par navigate thay

**Working Flow:**
- Show ID parse kare → Movie, Theater, ShowTime find kare
- Seats generate kare (random booking status)
- User seats select kare → Total calculate thay
- Proceed click kare → Booking data payment page par pass thay

---

#### **`features/booking/pages/Payment.tsx`** - Payment Processing Page
```typescript
const bookingData = location.state;
```

**Kya kare chhe:**
1. **Booking Summary Display**: 
   - Movie name, Theater, Show time
   - Selected seats
   - Price breakdown
   - Total amount
2. **Payment Processing**: 
   - Simulate payment (2 second delay)
   - Supabase bookings table ma insert kare
   - Payment status update kare
3. **Success Screen**: 
   - Confirmation message
   - Booking details
   - Back to home button

**Working Flow:**
- Booking data receive kare (from seat selection)
- Payment button click → Processing → Database ma save → Success screen

---

### 4. **Shared Components & Layout**

#### **`shared/components/layout/Header.tsx`** - Navigation Header
```typescript
const [searchQuery, setSearchQuery] = useState("");
```

**Kya kare chhe:**
1. **Logo**: BookMyShow logo with link to home
2. **Search Bar**: Movie/Event search input
3. **Location**: Current city display (Mumbai)
4. **User Menu**:
   - Login nathi to "Sign In" button
   - Login chhe to "Account" dropdown with Sign Out option
5. **Mobile Menu**: Hamburger menu for mobile view

**Working Flow:**
- Search submit kare → Home page par search query pass kare
- Sign Out click → Supabase auth sign out → Home page par redirect

---

#### **`features/movies/components/MovieCard.tsx`** - Movie Card Component
```typescript
<Link to={`/movie/${movie.id}`}>
```

**Kya kare chhe:**
1. **Movie Image**: Poster image display
2. **Rating Display**: Star rating ane vote count
3. **Movie Title**: Title with hover effect
4. **Genre Badges**: First 2 genres show kare
5. **Movie Info**: Language ane duration
6. **Click Action**: Movie detail page par navigate kare

**Working Flow:**
- Movie data as prop receive kare → Card display kare → Click par detail page par jay

---

### 5. **Contexts Directory - State Management**

#### **`contexts/AuthContext.tsx`** - Authentication Context
```typescript
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
```

**Kya kare chhe:**
1. **Auth State Management**: User ane session state manage kare
2. **Supabase Auth Listener**: Auth state change detect kare
3. **Session Check**: Page load par existing session check kare
4. **Context Provider**: All components ne auth state provide kare

**Working Flow:**
- App load thay → Existing session check kare → User state set kare
- Login/Signup thay → Auth state change → Context update thay
- All components `useAuth()` hook use kari ne user info access kare

---

### 6. **Data Directory - Static Data (`src/data`)**

#### **movies.ts** - Movies Data
```typescript
export const movies: Movie[] = [
  {
    id: "1",
    type: "movies",
    title: "Dune: Part Two",
    // ... movie details
    theaters: [
      {
        id: "t1",
        name: "PVR: Phoenix Mall",
        showTimes: [
          { time: "10:30 AM", price: 250, showId: "d2-t1-1030" },
        ],
      },
    ],
  },
];
```

**Kya kare chhe:**
1. **Movie Data Structure**: 
   - Basic info (title, image, rating, genre)
   - Theater information
   - Show times with prices
2. **Content Types**: Movies, Stream, Events, Plays, Sports, Activities
3. **Static Data**: Currently hardcoded, production ma database thi load thase

**Data Structure:**
- Each movie ma theaters array
- Each theater ma showTimes array
- Each showTime ma unique showId (seat selection mate)

---

### 7. **Lib & Services - External Services**

#### **`lib/supabase/client.ts`** - Supabase Client (Typed)
```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

**Kya kare chhe:**
1. **Supabase Connection**: Supabase backend sathe connection banave chhe
2. **Auth Config**: LocalStorage ma session store + auto token refresh
3. **Booking Service**: `features/booking/services/bookingService.ts` ahi no client use kare chhe

---

### 8. **Events API Flow (Dwaaro)**

Ae project ma **live events** data Dwaaro ni API thi aave chhe:

```text
EventsList.tsx → useEvents hook → eventService.getEvents()
→ GET /api/v1/odoo/events (Bearer token)
→ JSON response (events list) → UI cards
```

- `features/events/services/eventService.ts`  
  - Axios thi `https://dwaaro.axenorsuite.com/api/v1/odoo/events` call kare (proxy base `/api/v1/odoo`)  
  - Header ma **Bearer token** muki ne secure request kare chhe  
- `features/events/hooks/useEvents.ts`  
  - TanStack Query use kari events fetch + cache kare chhe (`useQuery`)  
- `features/events/pages/EventsList.tsx`  
  - API thi avela events ne nice cards ma show kare chhe (name, date, location, tags, price)
- `features/movies/pages/Home.tsx` ma \"Popular events\" section ma pan aa API no data use thay chhe (top 8 events).

Viva ma tame kahi shako:\n> \"User events page khole to `useEvents` hook React Query thi Dwaaro events API ne call kare chhe, JSON data aave chhe ane apde cards ma real events show kariye chhiye.\"

---

### 9. **Event Detail Flow (Gujenglish)**

Events mate pan movie-detail jevo j **detail page** chhe:

```text
EventsList/Home Popular events → See details click
→ /events/:id route → EventDetail.tsx
→ useEvent(id) hook → eventService.getEventById(id)
→ Dwaaro events API data → Full detail UI (date, venue, tickets)
```

- Header ma: title, start/end date, location, organizer, category ane tags chips show thay chhe.  
- Side panel ma: badha **ticket types** (Standard, VIP, etc.) name + price sathe list thay chhe ane \"Starting from ₹minPrice\" pan dekhay chhe.  
- Aa flow tame viva ma aavu kahi samjavi shako:  
  > \"User `See details` par click kare to URL ma `/events/{id}` ave chhe, `useEvent` hook Dwaaro events API thi specific event fetch kare chhe, ane EventDetail page ma date, venue, tags, tickets badhu nicely design thai ne dekhaay chhe.\"

---

### 10. **Complete User Flow (Step by Step)**

### **1. User Registration/Login**
```
User → /auth page → Sign Up/Sign In → Supabase Auth → Session Create → Home Page
```

### **2. Browse Movies**
```
User → Home Page (`features/movies/pages/Home`) → Category Filter/Search → Movie List Display → Click Movie Card
```

### **3. View Movie Details**
```
User → /movie/:id → Movie Details (`features/movies/pages/MovieDetail`) → Select Show Time → Click Book Button
```

### **4. Select Seats**
```
User → /book/:showId → Seat Layout (`features/booking/pages/SeatSelection`) → Select Seats → View Summary → Proceed to Pay
```

### **5. Payment**
```
User → /payment (`features/booking/pages/Payment`) → Review Booking → Click Pay Now → Demo Payment Process → Success Screen
```

---

## 🛠️ Technologies Used

1. **React 18**: UI library
2. **TypeScript**: Type safety
3. **Vite**: Build tool ane dev server
4. **React Router**: Client-side routing
5. **Supabase**: Backend (Auth + Database)
6. **TanStack Query**: Data fetching ane caching
7. **Tailwind CSS**: Styling
8. **shadcn/ui**: UI component library
9. **Zod**: Form validation
10. **Sonner**: Toast notifications

---

## 📝 Key Features

1. ✅ User Authentication (Sign Up/Sign In)
2. ✅ Movie/Event Browsing
3. ✅ Category Filtering
4. ✅ Search Functionality
5. ✅ Movie Detail View
6. ✅ Theater Selection
7. ✅ Show Time Selection
8. ✅ Seat Selection (Regular/Premium)
9. ✅ Booking Summary
10. ✅ Payment Processing (Demo)
11. ✅ Booking Confirmation
12. ✅ Database Integration

---

## 🔐 Security Features

1. **Authentication**: Supabase Auth use kare
2. **Row Level Security**: Database ma RLS policies
3. **Protected Routes**: Login required for booking
4. **Session Management**: Secure session handling

---

## 🎯 How Code Works (Technical Flow)

### **Component Rendering Flow:**
```
main.tsx → app/App.tsx → AppRoutes → Feature Page Components → Child Components
```

### **Feature-wise Folder Mapping (Gujenglish)**

- **Auth Feature**: `src/features/auth`  
  - `services/authService.ts` → OTP login/verify API calls  
  - `hooks/useAuth.tsx` → Auth API + state handling  
- **Movies Feature**: `src/features/movies`  
  - `pages/Home.tsx`, `pages/MovieDetail.tsx` → UI + flow  
  - `components/MovieCard.tsx` → Reusable movie card  
  - `services/movieService.ts` → Movies data (currently static `src/data/movies.ts`)  
- **Booking Feature**: `src/features/booking`  
  - `pages/TicketBook.tsx`, `pages/SeatSelection.tsx`, `pages/Payment.tsx`  
  - `services/bookingService.ts` → Booking create/list (Supabase ready)  
- **Shared**: `src/shared`  
  - Layout (`Header.tsx`, `VerticalSidebar.tsx`), shadcn UI, utils, constants, types, API client

### **State Management Flow:**
```
AuthContext → User State → Components (via useAuth hook)
Local State → useState hooks → Component Updates
```

### **Data Flow:**
```
Static Data (movies.ts) → Components → User Interactions → State Updates → UI Re-render
Database (Supabase) → API Calls → State Updates → UI Updates
```

---

## 📌 Important Points

1. **No Code Changes**: Aapdi code ma koi change kari nathi, sirf explanation di chhe
2. **Demo Payment**: Payment gateway demo chhe, production ma real payment integration joi
3. **Static Data**: Currently movies hardcoded chhe, future ma API thi load thase
4. **Responsive Design**: Mobile ane desktop dono mate responsive chhe
5. **Type Safety**: TypeScript use kare type checking mate

---

## 🚀 How to Run Project

1. **Dependencies Install**: `npm install`
2. **Environment Setup**: `.env` file ma Supabase credentials
3. **Dev Server**: `npm run dev`
4. **Build**: `npm run build`

---

## 📚 File Organization Summary (New)

``` 
src/
├── app/            → Main shell (`App.tsx`), routes, providers
├── features/       → Feature-wise code (auth, movies, booking, events)
├── shared/         → Common layout, UI, utils, constants, types, API client
├── contexts/       → Global contexts (e.g. `AuthContext.tsx`)
├── data/           → Static data (movies, events) as temporary backend
├── hooks/          → Custom hooks (e.g. `useAuth`, `use-mobile`)
├── lib/            → External integrations (e.g. `supabase` client)
├── pages/          → Only fallback/NotFound legacy pages
├── styles/         → Global styles (Tailwind & app CSS)
└── main.tsx        → Entry file mounting `app/App.tsx`
```

---

## 💡 Conclusion

Ae project ek complete **Movie Booking System** chhe, jema user ekthi browse kari, seat select kari, ane booking karvi shake. Supabase use kari ne authentication ane database management handle thay chhe. React Router thi navigation, TanStack Query thi data management, ane shadcn/ui thi beautiful UI components provide thay chhe.

**Koi pan specific part nu detailed explanation joiye to kahu!** 🎬


