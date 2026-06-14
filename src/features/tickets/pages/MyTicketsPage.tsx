import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useMyTickets } from "@/features/tickets/hooks/useMyTickets";
import { useTicketDetails } from "@/features/tickets/hooks/useTicketDetails";
import { ticketService, type TicketItem } from "@/features/tickets/services/ticketService";
import SplitTicketDialog from "@/features/tickets/components/SplitTicketDialog";
import { ROUTES } from "@/shared/constants/routes";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import { toast } from "sonner";
import { Calendar, Download, MapPin, Ticket, Loader2, Share2 } from "lucide-react";

const getTicketImageUrl = (image: string | null | undefined) => {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `/garba-auth${image.startsWith("/") ? image : `/${image}`}`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TicketDetailContent = ({ ticket }: { ticket: TicketItem }) => (
  <div className="space-y-3 text-sm">
    {ticket.ticket_no && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Ticket no.</span>
        <span className="font-medium">{ticket.ticket_no}</span>
      </div>
    )}
    {ticket.order_id && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Order ID</span>
        <span className="font-medium">{ticket.order_id}</span>
      </div>
    )}
    {ticket.ticket_type && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Ticket type</span>
        <span className="font-medium capitalize">{ticket.ticket_type}</span>
      </div>
    )}
    {ticket.qty != null && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Quantity</span>
        <span className="font-medium">{ticket.qty}</span>
      </div>
    )}
    {(ticket.total_amount ?? ticket.price) != null && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Amount</span>
        <span className="font-medium">₹{ticket.total_amount ?? ticket.price}</span>
      </div>
    )}
    {ticket.status && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Status</span>
        <span className="font-medium capitalize">{ticket.status}</span>
      </div>
    )}
    {(ticket.event_date || ticket.start_date) && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Event date</span>
        <span className="font-medium">{formatDate(ticket.event_date ?? ticket.start_date)}</span>
      </div>
    )}
    {ticket.address && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Venue</span>
        <span className="font-medium text-right">{ticket.address}</span>
      </div>
    )}
    {ticket.transaction_id && (
      <div className="flex justify-between gap-4">
        <span className="text-muted-foreground">Transaction</span>
        <span className="font-medium">{ticket.transaction_id}</span>
      </div>
    )}
  </div>
);

const MyTicketsPage = () => {
  const { user, session, loading: authLoading } = useAuth();
  const { data, isLoading, error, refetch, isFetching } = useMyTickets(
    session?.access_token,
    !!user && !!session?.access_token && !authLoading,
  );
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [splitTicket, setSplitTicket] = useState<TicketItem | null>(null);

  const { data: detailData, isLoading: detailLoading } = useTicketDetails(
    selectedTicketId,
    session?.access_token,
    selectedTicketId != null,
  );

  const handleDownload = async (ticketId: number) => {
    if (!session?.access_token) {
      toast.error("Sign in to download tickets");
      return;
    }

    setDownloadingId(ticketId);
    try {
      await ticketService.downloadTicket(ticketId, session.access_token);
      toast.success("Ticket download started");
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Could not download ticket");
    } finally {
      setDownloadingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-10">
          <p className="text-center text-muted-foreground">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <Ticket className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-lg mb-4">Please sign in to view your tickets.</p>
          <Link to={getAuthUrl(ROUTES.MY_TICKETS)}>
            <Button>Sign in</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center space-y-4">
          <p className="text-destructive">Unable to load tickets. Please try again.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tickets = data.data ?? [];
  const selectedTicket = detailData?.status === "success" ? detailData.data : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b bg-gradient-to-br from-[#1a0a0e] via-[#2d1219] to-[#1a1a1a] text-white">
        <div className="container py-10 md:py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Ticket className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">My Tickets</h1>
              <p className="text-sm text-white/70 mt-1">Your purchased event tickets</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline">Total: {data.meta?.total ?? tickets.length}</Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {tickets.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed bg-muted/30 px-8 py-16 text-center">
            <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No tickets yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Tickets appear here after you complete payment for an event.
            </p>
            <Link to={ROUTES.EVENTS}>
              <Button>Browse events</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => {
              const imageUrl = getTicketImageUrl(ticket.event_image);
              const title = ticket.event_name ?? `Ticket #${ticket.id}`;

              return (
                <Card key={ticket.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-40 bg-muted">
                    {imageUrl ? (
                      <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#8B5E3C] to-[#6D4C3B] text-3xl font-bold text-white">
                        {title.charAt(0)}
                      </div>
                    )}
                    {ticket.status && (
                      <Badge className="absolute top-3 right-3 capitalize">{ticket.status}</Badge>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <div>
                      <h2 className="font-semibold text-lg line-clamp-2">{title}</h2>
                      {ticket.ticket_type && (
                        <p className="text-sm text-muted-foreground capitalize mt-1">
                          {ticket.ticket_type}
                          {ticket.qty ? ` · Qty ${ticket.qty}` : ""}
                        </p>
                      )}
                    </div>

                    {(ticket.event_date || ticket.start_date) && (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        {formatDate(ticket.event_date ?? ticket.start_date)}
                      </p>
                    )}

                    {ticket.address && (
                      <p className="flex items-start gap-2 text-sm text-muted-foreground line-clamp-2">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        {ticket.address}
                      </p>
                    )}

                    {(ticket.total_amount ?? ticket.price) != null && (
                      <p className="text-sm font-semibold">
                        ₹{ticket.total_amount ?? ticket.price}
                      </p>
                    )}

                    <div className="mt-auto flex flex-col gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        View details
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDownload(ticket.id)}
                          disabled={downloadingId === ticket.id}
                        >
                          {downloadingId === ticket.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSplitTicket(ticket)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Split
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={selectedTicketId != null}
        onOpenChange={(open) => {
          if (!open) setSelectedTicketId(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ticket details</DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <p className="text-sm text-muted-foreground py-4">Loading ticket details...</p>
          ) : selectedTicket ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{selectedTicket.event_name ?? "Ticket"}</h3>
              <TicketDetailContent ticket={selectedTicket} />
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => selectedTicketId && handleDownload(selectedTicketId)}
                  disabled={downloadingId === selectedTicketId}
                >
                  {downloadingId === selectedTicketId ? "Downloading..." : "Download ticket"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSplitTicket(selectedTicket);
                    setSelectedTicketId(null);
                  }}
                >
                  Split ticket
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-destructive py-4">
              {detailData?.message || "Could not load ticket details."}
            </p>
          )}
        </DialogContent>
      </Dialog>

      <SplitTicketDialog
        open={splitTicket != null}
        onOpenChange={(open) => {
          if (!open) setSplitTicket(null);
        }}
        ticket={splitTicket}
        userToken={session?.access_token}
      />

      <Footer />
    </div>
  );
};

export default MyTicketsPage;
