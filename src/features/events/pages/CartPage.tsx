import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCart, CART_QUERY_KEY } from "@/features/events/hooks/useCart";
import { useEvent } from "@/features/events/hooks/useEvent";
import { useLocalCart } from "@/features/events/hooks/useLocalCart";
import { cartService } from "@/features/events/services/cartService";
import CartEventDetailCard from "@/features/events/components/CartEventDetailCard";
import TicketTypePickerDialog from "@/features/events/components/TicketTypePickerDialog";
import type { CartEventDetail } from "@/features/events/services/cartService";
import type { EventTicketOption } from "@/features/events/types/eventTickets";
import { ROUTES } from "@/shared/constants/routes";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import { eventTicketToCartTicket, mapCartTicketToEventTicket } from "@/features/events/types/eventTickets";
import { executeTicketCheckout, type CartTicketNavigationState } from "@/features/events/utils/ticketCheckout";
import { useCreateOrder } from "@/features/payment/hooks/useCheckout";
import { toast } from "sonner";
import { ShoppingCart, Ticket, ArrowRight } from "lucide-react";

const getEventImageUrl = (image: string | null | undefined) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/garba-auth${image.startsWith("/") ? image : `/${image}`}`;
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
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createOrder = useCreateOrder(session?.access_token);
  const initialNavState = location.state as CartTicketNavigationState | null;
  const pendingTicketNavRef = useRef<CartTicketNavigationState | null>(
    initialNavState?.selectedTicketId ? initialNavState : null,
  );

  const { data, isLoading, error } = useCart(
    session?.access_token,
    !!user && !!session?.access_token && !authLoading,
  );
  const { entries: localEntries, removeEvent, setQuantity, clearAll, addTicket } = useLocalCart();

  const [apiQuantities, setApiQuantities] = useState<Record<number, number>>(() => {
    if (!initialNavState?.selectedTicketId) return {};
    return { [initialNavState.selectedTicketId]: 1 };
  });
  const [navTickets, setNavTickets] = useState<EventTicketOption[]>(initialNavState?.tickets ?? []);
  const [checkingOutEventId, setCheckingOutEventId] = useState<number | null>(null);
  const [removingEventId, setRemovingEventId] = useState<number | null>(null);
  const [pickerEventId, setPickerEventId] = useState<number | null>(null);

  const apiEvent = data?.fullDetail?.event ?? null;
  const { data: apiEventDetails } = useEvent(
    apiEvent ? String(apiEvent.id) : undefined,
    session?.access_token,
    !!apiEvent,
  );
  const apiCartTickets = useMemo(
    () => (data?.fullDetail?.tickets ?? []).map(mapCartTicketToEventTicket),
    [data?.fullDetail?.tickets],
  );
  const apiDisplayTickets = useMemo(() => {
    if (apiEventDetails?.tickets?.length) return apiEventDetails.tickets;
    if (apiCartTickets.length > 0) return apiCartTickets;
    return navTickets;
  }, [apiEventDetails?.tickets, apiCartTickets, navTickets]);

  const { data: pickerEventDetails, isLoading: pickerEventLoading } = useEvent(
    pickerEventId ? String(pickerEventId) : undefined,
    session?.access_token,
    pickerEventId != null,
  );

  const extraLocalEntries = useMemo(
    () => localEntries.filter((entry) => entry.event.id !== apiEvent?.id),
    [localEntries, apiEvent?.id],
  );

  const hasCart =
    Boolean(apiEvent) || extraLocalEntries.length > 0 || Boolean(initialNavState?.event);

  const pickerEntry = useMemo(() => {
    if (!pickerEventId) return null;
    if (apiEvent?.id === pickerEventId) {
      return { event: apiEvent, tickets: apiDisplayTickets };
    }
    const local = localEntries.find((entry) => entry.event.id === pickerEventId);
    return local ? { event: local.event, tickets: local.tickets } : null;
  }, [pickerEventId, apiEvent, apiDisplayTickets, localEntries]);

  const pickerTickets = useMemo(() => {
    if (pickerEventDetails?.tickets?.length) return pickerEventDetails.tickets;
    return pickerEntry?.tickets ?? [];
  }, [pickerEventDetails?.tickets, pickerEntry?.tickets]);

  const applyNavToApiCart = useCallback(
    (navState: CartTicketNavigationState) => {
      if (!navState.selectedTicketId) return false;
      if (apiEvent && navState.event && apiEvent.id !== navState.event.id) return false;
      if (navState.tickets?.length) setNavTickets(navState.tickets);
      setApiQuantities((prev) => ({
        ...prev,
        [navState.selectedTicketId]: Math.max(1, prev[navState.selectedTicketId] ?? 0),
      }));
      return true;
    },
    [apiEvent],
  );

  useEffect(() => {
    const navState = location.state as CartTicketNavigationState | null;
    if (!navState?.selectedTicketId) return;

    pendingTicketNavRef.current = navState;
    if (navState.tickets?.length) setNavTickets(navState.tickets);
    setApiQuantities((prev) => ({
      ...prev,
      [navState.selectedTicketId]: Math.max(1, prev[navState.selectedTicketId] ?? 0),
    }));
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const navState = pendingTicketNavRef.current;
    if (!navState?.selectedTicketId || authLoading || isLoading) return;
    applyNavToApiCart(navState);
    pendingTicketNavRef.current = null;
  }, [authLoading, isLoading, applyNavToApiCart]);

  useEffect(() => {
    if (apiCartTickets.length > 0) setNavTickets([]);
  }, [apiCartTickets.length]);

  const handleApiQtyChange = (ticketId: number, nextQty: number) => {
    const ticket = apiDisplayTickets.find((t) => t.id === ticketId);
    const maxQty =
      ticket?.available_tickets && ticket.available_tickets > 0 ? ticket.available_tickets : 10;
    const clamped = Math.min(maxQty, Math.max(0, nextQty));

    setApiQuantities((prev) => {
      if (clamped <= 0) {
        const { [ticketId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [ticketId]: clamped };
    });
  };

  const handleLocalQtyChange = (eventId: number, ticketId: number, nextQty: number) => {
    const entry = localEntries.find((item) => item.event.id === eventId);
    const ticket = entry?.tickets.find((t) => t.id === ticketId);
    const maxQty =
      ticket?.available_tickets && ticket.available_tickets > 0 ? ticket.available_tickets : 10;
    const clamped = Math.min(maxQty, Math.max(0, nextQty));
    setQuantity(eventId, ticketId, clamped);
  };

  const handleRemoveApiCart = async () => {
    if (!apiEvent) return;
    setRemovingEventId(apiEvent.id);
    try {
      await cartService.removeCart(session?.access_token);
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setApiQuantities({});
      setNavTickets([]);
      toast.success("Event removed from cart");
    } catch {
      toast.error("Could not remove event. Please try again.");
    } finally {
      setRemovingEventId(null);
    }
  };

  const handleRemoveLocalEvent = (eventId: number) => {
    setRemovingEventId(eventId);
    removeEvent(eventId);
    toast.success("Event removed from cart");
    setRemovingEventId(null);
  };

  const handleCheckout = async (
    event: CartEventDetail,
    tickets: EventTicketOption[],
    quantities: Record<number, number>,
  ) => {
    const selected = tickets.filter((ticket) => (quantities[ticket.id] ?? 0) > 0);
    if (selected.length === 0) {
      openTicketTypePicker(event.id);
      return;
    }

    if (selected.length > 1) {
      toast.info("Proceeding with the first selected ticket type for this event.");
    }

    const ticket = selected[0];
    const qty = quantities[ticket.id] ?? 1;

    setCheckingOutEventId(event.id);
    try {
      await executeTicketCheckout({
        userToken: session?.access_token,
        eventId: event.id,
        eventName: event.name,
        ticket: eventTicketToCartTicket(ticket),
        qty,
        createOrder: createOrder.mutateAsync,
        navigate,
        onUnauthorized: () => navigate(getAuthUrl(`${location.pathname}${location.search}`)),
      });
    } finally {
      setCheckingOutEventId(null);
    }
  };

  const handleSelectTicketType = (ticket: EventTicketOption) => {
    if (!pickerEventId) return;

    if (apiEvent?.id === pickerEventId) {
      setApiQuantities((prev) => ({
        ...prev,
        [ticket.id]: Math.max(1, prev[ticket.id] ?? 0),
      }));
    } else {
      const entry = localEntries.find((item) => item.event.id === pickerEventId);
      if (entry) {
        addTicket(
          entry.event,
          pickerTickets,
          ticket,
          Math.max(1, entry.quantities[ticket.id] ?? 1),
        );
      }
    }

    setPickerEventId(null);
  };

  const openTicketTypePicker = (eventId: number) => {
    setPickerEventId(eventId);
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
          <p className="text-muted-foreground mb-6">Your saved events will appear here.</p>
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

  const eventCount =
    (apiEvent ? 1 : 0) +
    extraLocalEntries.length;

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
                {hasCart
                  ? `${eventCount} event${eventCount > 1 ? "s" : ""} in your cart`
                  : "No events in your cart"}
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
          <div className="mx-auto max-w-2xl space-y-6">
            {apiEvent && (
              <CartEventDetailCard
                event={apiEvent}
                imageUrl={getEventImageUrl(apiEvent.image)}
                tickets={apiDisplayTickets}
                quantities={apiQuantities}
                userToken={session?.access_token}
                isCheckingOut={checkingOutEventId === apiEvent.id}
                isRemoving={removingEventId === apiEvent.id}
                onQtyChange={handleApiQtyChange}
                onBuyTickets={() => {
                  void handleCheckout(apiEvent, apiDisplayTickets, apiQuantities);
                }}
                onRemove={() => {
                  void handleRemoveApiCart();
                }}
                onAddTicketType={() => openTicketTypePicker(apiEvent.id)}
              />
            )}

            {extraLocalEntries.map((entry) => (
              <CartEventDetailCard
                key={entry.event.id}
                event={entry.event}
                imageUrl={getEventImageUrl(entry.event.image)}
                tickets={entry.tickets}
                quantities={entry.quantities}
                userToken={session?.access_token}
                isCheckingOut={checkingOutEventId === entry.event.id}
                isRemoving={removingEventId === entry.event.id}
                onQtyChange={(ticketId, qty) => handleLocalQtyChange(entry.event.id, ticketId, qty)}
                onBuyTickets={() => {
                  void handleCheckout(entry.event, entry.tickets, entry.quantities);
                }}
                onRemove={() => handleRemoveLocalEvent(entry.event.id)}
                onAddTicketType={() => openTicketTypePicker(entry.event.id)}
              />
            ))}

            {eventCount > 1 && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    void handleRemoveApiCart();
                    clearAll();
                  }}
                >
                  Clear all events
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <TicketTypePickerDialog
        open={pickerEventId != null}
        onOpenChange={(open) => {
          if (!open) setPickerEventId(null);
        }}
        eventName={pickerEntry?.event.name ?? pickerEventDetails?.name}
        tickets={pickerTickets}
        isLoading={pickerEventLoading}
        onSelectTicket={handleSelectTicketType}
      />
    </PageShell>
  );
};

export default CartPage;
