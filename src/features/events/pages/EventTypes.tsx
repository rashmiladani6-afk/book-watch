import { Navigate } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

/**
 * Event types are no longer served by a separate Garba Town endpoint.
 * Redirect users to the popular events list.
 */
const EventTypes = () => {
  return <Navigate to={ROUTES.EVENTS_LIST} replace />;
};

export default EventTypes;
