import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart, CART_QUERY_KEY } from "@/features/events/hooks/useCart";
import { useEventTickets } from "@/features/events/hooks/useEventTickets";
import { cartService } from "@/features/events/services/cartService";
import CartDetailDialog from "@/features/events/components/CartDetailDialog";
import TicketTypePickerDialog from "@/features/events/components/TicketTypePickerDialog";
import TicketPurchaseDetailDialog from "@/features/events/components/TicketPurchaseDetailDialog";
import type { EventTicketOption } from "@/features/events/types/eventTickets";
import { mapCartTicketToEventTicket } from "@/features/events/types/eventTickets";
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

type CartTicketFlowStep = "closed" | "eventDetail" | "typePicker" | "ticketDetail";

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
  const { data, isLoading, error, refetch, isFetching } = useCart(
    session?.access_token,
    !!user && !!session?.access_token && !authLoading,
  );
  const [isRemoving, setIsRemoving] = useState(false);
  const [flowStep, setFlowStep] = useState<CartTicketFlowStep>("closed");
  const [selectedTicket, setSelectedTicket] = useState<EventTicketOption | null>(null);

  const fullDetail = data?.fullDetail ?? { event: null, tickets: [] };
  const cartTickets = fullDetail.tickets ?? [];
  const eventId = fullDetail.event?.id;
  const needsTicketFallback = cartTickets.length === 0;
  const pickerOrDetailOpen = flowStep === "typePicker" || flowStep === "ticketDetail";

  const {
    tickets: fallbackTickets,
    isLoading: ticketsLoading,
    error: ticketsError,
    replaceRequired,
    forceLoadTickets,
    isForceLoading,
    refetch: refetchTickets,
  } = useEventTickets(
    eventId,
    undefined,
    session?.access_token,
    pickerOrDetailOpen && needsTicketFallback,
  );

  const displayTickets = useMemo(() => {
    if (cartTickets.length > 0) {
      return cartTickets.map(mapCartTicketToEventTicket);
    }
    return fallbackTickets;
  }, [cartTickets, fallbackTickets]);

  const closeFlow = () => {
    setFlowStep("closed");
    setSelectedTicket(null);
  };

  const handleRemoveCart = async () => {
    setIsRemoving(true);
    try {
      await cartService.removeCart(session?.access_token);
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      closeFlow();
      toast.success("Cart cleared successfully");
    } catch {
      toast.error("Could not remove cart. Please try again.");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleConfirmReplaceCart = async () => {
    try {
      await forceLoadTickets();
      await refetch();
    } catch {
      // Error surfaced via tickets query state
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
  const hasCart = items.length > 0 || Boolean(fullDetail.event);

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

      <div className="container py-8 md:py-12 space-y-6">
        <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Cart</strong> is for unpaid items.
            After payment, your ticket appears in{" "}
            <strong className="text-foreground">My Tickets</strong>.
          </p>
          <Link to={ROUTES.MY_TICKETS}>
            <Button variant="outline" size="sm" className="shrink-0">
              <Ticket className="mr-2 h-4 w-4" />
              View my tickets
            </Button>
          </Link>
        </div>

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
          <div className="mx-auto max-w-2xl space-y-4">
            {items.map((item) => {
              const itemEventId = item.event_id ?? item.id;
              const name = item.event_name ?? item.name ?? fullDetail.event?.name ?? "Event";
              const imageUrl = getEventImageUrl(
                item.event_image ?? item.image ?? fullDetail.event?.image,
              );

              return (
                <article
                  key={`${item.id}-${itemEventId}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setFlowStep("eventDetail")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFlowStep("eventDetail");
                    }
                  }}
                  className="flex cursor-pointer flex-col sm:flex-row gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="h-36 w-full sm:h-32 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {imageUrl ? (
                      <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#955F3B] to-[#7a4d30] text-2xl font-bold text-white">
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
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-[#955F3B]">
                        <Ticket className="h-4 w-4" />
                        {displayTickets.length > 0
                          ? `${displayTickets.length} ticket type(s)`
                          : `₹${item.sub_total ?? item.price ?? fullDetail.event?.price ?? 0}`}
                      </p>
                      <span className="text-xs font-medium text-[#955F3B]">View details</span>
                    </div>
                  </div>
                </article>
              );
            })}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1 bg-[#955F3B] hover:bg-[#7a4d30]"
                onClick={() => setFlowStep("typePicker")}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Buy tickets
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleRemoveCart}
                disabled={isRemoving}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isRemoving ? "Removing..." : "Remove from cart"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <CartDetailDialog
        event={fullDetail.event}
        open={flowStep === "eventDetail"}
        onOpenChange={(open) => {
          if (!open) closeFlow();
        }}
        ticketCount={displayTickets.length}
        onBuyTickets={() => setFlowStep("typePicker")}
      />

      <TicketTypePickerDialog
        open={flowStep === "typePicker" && !replaceRequired}
        onOpenChange={(open) => {
          if (!open) closeFlow();
        }}
        eventName={fullDetail.event?.name}
        tickets={displayTickets}
        isLoading={needsTicketFallback && ticketsLoading}
        error={ticketsError}
        onRetry={() => {
          void refetchTickets();
          void refetch();
        }}
        onSelectTicket={(ticket) => {
          setSelectedTicket(ticket);
          setFlowStep("ticketDetail");
        }}
      />

      <TicketPurchaseDetailDialog
        open={flowStep === "ticketDetail"}
        onOpenChange={(open) => {
          if (!open) closeFlow();
        }}
        event={fullDetail.event!}
        ticket={selectedTicket}
        userToken={session?.access_token}
        onBack={() => setFlowStep("typePicker")}
      />

      <AlertDialog
        open={replaceRequired && pickerOrDetailOpen}
        onOpenChange={(open) => {
          if (!open) closeFlow();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace cart event?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart already has a different event. Replace it to load ticket options.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeFlow}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReplaceCart} disabled={isForceLoading}>
              {isForceLoading ? "Replacing..." : "Replace event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
};

export default CartPage;
