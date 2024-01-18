import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const LoginView = ({ setIsAuthenticated }) => {
  // State to hold username and password input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Hook to navigate between routes
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send a POST request to the /api/auth endpoint
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Check the response status
    if (response.ok) {
      // If the login was successful, set authentication status to true and navigate to admin view
      setIsAuthenticated(true);
      navigate("/admin");
    } else {
      // If the login failed, show an error message
      console.log("Credentials are incorrect.");
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
