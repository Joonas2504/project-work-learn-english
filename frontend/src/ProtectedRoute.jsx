import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

/**
 * A protected route component that renders the specified element if authenticated, otherwise navigates to the login page.
 * @component
 * @name ProtectedRoute
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.element - The React element to be rendered if authenticated.
 * @param {boolean} props.isAuthenticated - A boolean indicating the authentication status.
 * @returns {React.ReactNode|Navigate} - Returns the specified element if authenticated, otherwise a navigation component to the login page.
 */
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
