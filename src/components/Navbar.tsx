import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const handleCVBuilder = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to use the CV Builder.");
      return;
    }
    navigate("/cv-builder");
  };

  return (
    <nav>
      <div className="nav-top-row">
        <h2 className="nav-brand">NaijaIntern</h2>

        <button
          className="nav-hamburger"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="nav-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`nav-links-wrapper ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <ul className="nav-menu">
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Discover</Link>
          </li>
          <li>
            <Link to="/Guide" onClick={() => setMobileMenuOpen(false)}>Guide</Link>
          </li>
          <li>
            <button
              className="nav-button"
              onClick={() => {
                handleCVBuilder();
                setMobileMenuOpen(false);
              }}
            >
              CV Builder
            </button>
          </li>
        </ul>

        <div className="nav-sign">
          {isLoggedIn ? (
            <button
              className="nav-button logout-btn-nav"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/LoginSignup" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;