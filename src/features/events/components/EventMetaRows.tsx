import { Calendar, MapPin, Ticket } from "lucide-react";

const formatEventDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

interface EventMetaRowsProps {
  startDate?: string;
  endDate?: string;
  address?: string;
  organizer?: string;
  ticketSummary?: string;
  className?: string;
}

const EventMetaRows = ({
  startDate,
  endDate,
  address,
  organizer,
  ticketSummary,
  className,
}: EventMetaRowsProps) => (
  <div className={`space-y-1.5 text-sm text-muted-foreground ${className ?? ""}`}>
    {startDate && (
      <p className="flex items-center gap-2">
        <Calendar className="h-4 w-4 shrink-0" />
        <span>
          {formatEventDate(startDate)}
          {endDate ? ` — ${formatEventDate(endDate)}` : ""}
        </span>
      </p>
    )}
    {address && (
      <p className="flex items-start gap-2">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
        <span className="line-clamp-2">{address}</span>
      </p>
    )}
    {organizer && (
      <p className="flex items-center gap-2">
        <Ticket className="h-4 w-4 shrink-0" />
        <span>{organizer}</span>
        {ticketSummary && (
          <span className="font-medium text-[#955F3B]">· {ticketSummary}</span>
        )}
      </p>
    )}
    {!organizer && ticketSummary && (
      <p className="flex items-center gap-2 font-medium text-[#955F3B]">
        <Ticket className="h-4 w-4 shrink-0" />
        {ticketSummary}
      </p>
    )}
  </div>
);

export default EventMetaRows;
