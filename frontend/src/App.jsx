import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LearnView from "./LearnView";
import AdminView from "./AdminView"; // Import the AdminView component

const App = () => {
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
              <Link to="/admin">Admin</Link>
            </li>
          </ul>
        </nav>

        {/* Route configuration */}
        <Routes>
          <Route path="/admin" element={<AdminView />} />
          <Route path="/" element={<LearnView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
