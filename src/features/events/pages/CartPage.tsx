import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart, CART_QUERY_KEY } from "@/features/events/hooks/useCart";
import { cartService } from "@/features/events/services/cartService";
import CartDetailDialog from "@/features/events/components/CartDetailDialog";
import EventTicketsPanel from "@/features/events/components/EventTicketsPanel";
import { ROUTES } from "@/shared/constants/routes";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  ShoppingCart,
  Trash2,
  Ticket,
  ArrowRight,
} from "lucide-react";

const getEventImageUrl = (image: string | null | undefined) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/garba-auth${image.startsWith("/") ? image : `/${image}`}`;
};

const formatEventDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Header />
    {children}
    <Footer />
  </div>
);

const CartPage = () => {
  const { user, session, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useCart(
    session?.access_token,
    !!user && !!session?.access_token && !authLoading,
  );
  const [isRemoving, setIsRemoving] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleRemoveCart = async () => {
    setIsRemoving(true);
    try {
      await cartService.removeCart(session?.access_token);
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setDetailOpen(false);
      toast.success("Cart cleared successfully");
    } catch {
      toast.error("Could not remove cart. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <PageShell>
        <div className="container py-10">
          <p className="text-center text-muted-foreground">Loading your cart...</p>
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="container py-20 text-center max-w-md mx-auto">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Sign in to view cart</h1>
          <p className="text-muted-foreground mb-6">Your saved event will appear here.</p>
          <Link to={getAuthUrl(ROUTES.CART)}>
            <Button size="lg">Sign in</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="container py-20 text-center">
          <p className="text-destructive">Unable to load cart. Please try again later.</p>
        </div>
      </PageShell>
    );
  }

  const items = data?.items ?? [];
  const fullDetail = data?.fullDetail ?? { event: null, tickets: [] };
  const hasCart = items.length > 0 || Boolean(fullDetail.event);
  const subtotal =
    fullDetail.tickets.length > 0
      ? fullDetail.tickets.reduce((sum, t) => sum + t.price, 0)
      : items.reduce((sum, item) => sum + (item.sub_total ?? item.price ?? 0), 0);

  return (
    <PageShell>
      <section className="border-b bg-gradient-to-br from-[#1a0a0e] via-[#2d1219] to-[#1a1a1a] text-white">
        <div className="container py-10 md:py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Cart</h1>
              <p className="text-sm text-white/70 mt-1">
                {hasCart ? "Tap your event to view full cart details" : "No events in your cart"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        {!hasCart ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed bg-muted/30 px-8 py-16 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Browse events and add one to your cart to continue.
            </p>
            <Link to={ROUTES.EVENTS}>
              <Button>
                Explore events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const eventId = item.event_id ?? item.id;
                const name = item.event_name ?? item.name ?? fullDetail.event?.name ?? "Event";
                const imageUrl = getEventImageUrl(
                  item.event_image ?? item.image ?? fullDetail.event?.image,
                );

                return (
                  <article
                    key={`${item.id}-${eventId}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetailOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDetailOpen(true);
                      }
                    }}
                    className="flex cursor-pointer flex-col sm:flex-row gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div className="h-36 w-full sm:h-32 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {imageUrl ? (
                        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] text-2xl font-bold text-white">
                          {name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col min-w-0">
                      <h2 className="font-semibold text-lg line-clamp-2">{name}</h2>
                      {(item.start_date || fullDetail.event?.start_date) && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 shrink-0" />
                          {formatEventDate(item.start_date ?? fullDetail.event?.start_date ?? "")}
                        </p>
                      )}
                      {(item.address || fullDetail.event?.address) && (
                        <p className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {item.address ?? fullDetail.event?.address}
                          </span>
                        </p>
                      )}
                      <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                        <p className="flex items-center gap-1.5 text-sm font-semibold">
                          <Ticket className="h-4 w-4 text-primary" />
                          {fullDetail.tickets.length > 0
                            ? `${fullDetail.tickets.length} ticket type(s)`
                            : `₹${item.sub_total ?? item.price ?? 0}`}
                        </p>
                        <span className="text-xs font-medium text-primary">View details</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="space-y-4">
              {fullDetail.event && fullDetail.tickets.length > 0 && (
                <EventTicketsPanel
                  eventId={fullDetail.event.id}
                  tickets={fullDetail.tickets}
                  userToken={session?.access_token}
                  title="Buy tickets"
                  className="rounded-2xl border bg-card p-4 shadow-sm"
                />
              )}

              <div className="rounded-2xl border bg-card p-6 h-fit space-y-4 shadow-sm">
                <h3 className="font-semibold text-lg">Order summary</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <Button className="w-full" variant="outline" onClick={() => setDetailOpen(true)}>
                  View cart details
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleRemoveCart}
                  disabled={isRemoving}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isRemoving ? "Removing..." : "Remove from cart"}
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>

      <CartDetailDialog
        event={fullDetail.event}
        tickets={fullDetail.tickets}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        userToken={session?.access_token}
      />
    </PageShell>
  );
};

export default CartPage;
