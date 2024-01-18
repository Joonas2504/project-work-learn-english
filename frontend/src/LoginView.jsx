import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Fetch admin username and password from environment variables
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const LoginView = ({ setIsAuthenticated }) => {
  // State to hold username and password input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Hook to navigate between routes
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if entered credentials match admin username and password
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set authentication status to true and navigate to admin view
      setIsAuthenticated(true);
      navigate("/admin");
    } else {
      console.log("Credentials are incorrect.");
      // The entered credentials are incorrect. Show an error message...
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input for username */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      {/* Input for password */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {/* Button to submit the form */}
      <button type="submit">Log in</button>
    </form>
  );
};

// PropTypes for setIsAuthenticated prop
LoginView.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired, // Function to set authentication status
};

export default LoginView;
