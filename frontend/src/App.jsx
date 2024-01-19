import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LearnView from "./LearnView";
import AdminView from "./AdminView";
import LoginView from "./LoginView";
import ProtectedRoute from "./ProtectedRoute";
import { useState } from "react";

// ... (other imports)

const App = () => {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle logout and update authentication status
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        {/* Navigation links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Learn</Link>
            </li>
            <li>
              {isAuthenticated ? (
                <Link to="/login" onClick={handleLogout}>
                  Logout
                </Link>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </nav>

        {/* Route configuration */}
        <Routes>
          {/* Route for the login page */}
          <Route
            path="/login"
            element={<LoginView setIsAuthenticated={setIsAuthenticated} />}
          />
          {/* Route for the admin page with protection */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminView onLogout={handleLogout} />}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          {/* Default route for the learn page */}
          <Route path="/" element={<LearnView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
