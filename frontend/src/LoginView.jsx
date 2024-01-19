import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * LoginView component for the login page.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setIsAuthenticated - Function to set authentication status.
 * @returns {JSX.Element} The rendered component.
 */
const LoginView = ({ setIsAuthenticated }) => {
  // State to hold username and password input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Hook to navigate between routes
  const navigate = useNavigate();

  /**
   * Handles the form submission.
   * @async
   * @function
   * @name handleSubmit
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username) {
      alert("Username is required.");
      return;
    } else if (!password) {
      alert("Password is required.");
      return;
    }
    // Send a POST request to the /api/auth endpoint
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
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
      alert("Credentials are incorrect.");
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

/**
 * PropTypes for the LoginView component.
 * @name propTypes
 * @type {Object}
 * @property {Function} setIsAuthenticated - Function to set authentication status.
 */
LoginView.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired, // Function to set authentication status
};

export default LoginView;
