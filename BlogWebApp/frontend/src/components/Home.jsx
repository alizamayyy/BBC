import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user information from localStorage
    const userString = localStorage.getItem("user");
    console.log("userString:", userString);

    // Check if user data exists in localStorage
    if (userString) {
      try {
        const user = JSON.parse(userString);
        console.log("Parsed user:", user);
        setUser(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      // User data not found in localStorage, handle accordingly
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage upon logout
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>User ID: {user.id}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>
          You are not logged in. Please <Link to="/">login</Link>.
        </p>
      )}
      <nav>
        <ul>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
