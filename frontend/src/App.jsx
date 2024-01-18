import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LearnView from "./LearnView";
import AdminView from "./AdminView";
import LoginView from "./LoginView";
import ProtectedRoute from "./ProtectedRoute";
import { useState } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Learn</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/login"
            element={<LoginView setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminView onLogout={handleLogout} />}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route path="/" element={<LearnView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
