import { Navigate } from "react-router-dom";

/**
 * Event types are no longer served by a separate Garba Town endpoint.
 * Redirect users to the popular events list.
 */
const EventTypes = () => {
  return <Navigate to="/events/list" replace />;
};

export default EventTypes;
