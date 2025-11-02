import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Handle navigation
  const handleNavigate = (path) => {
    navigate(path);
  };

  // Fetch user details if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/auth/get-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left" onClick={() => handleNavigate("/")}>
        <h2 className="navbar-logo">Wisdom<span>Pool</span></h2>
      </div>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/experiences" className="navbar-link">All Experiences</Link>
        <Link to="/my-experiences" className="navbar-link">My Experiences</Link>
        <Link to="/share-experience" className="navbar-link">Share Experience</Link>
        <Link to="/ai-career-mentor" className="navbar-link">AI Career Mentor</Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="navbar-user">
            <span className="navbar-welcome">
              Welcome, <strong>{user.name || "User"}</strong>
            </span>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button
            className="navbar-login"
            onClick={() => handleNavigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
