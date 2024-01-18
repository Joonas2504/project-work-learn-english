import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, isAuthenticated }) => {
  // Render the specified element if authenticated, otherwise navigate to the login page
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// PropTypes for element and isAuthenticated props
ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired, // React element to be rendered
  isAuthenticated: PropTypes.bool.isRequired, // Boolean indicating authentication status
};

export default ProtectedRoute;
