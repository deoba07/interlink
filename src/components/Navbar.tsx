import { Link, useNavigate , useLocation} from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useTheme } from "../ThemeContext";
import "./Navbar.css";
import NaijaIntern from "../assets/NaijaIntern.jpeg";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isLoggedIn = !!localStorage.getItem("token");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("naijaintern_cv_draft"); // clear any saved CV draft too
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


  const themeLabel =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
 
  // The same button is rendered in two places: next to the hamburger on
  // phones, and next to the account link on desktop. CSS shows only one.
  const renderThemeToggle = (placement: "mobile" | "desktop") => (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${placement}`}
      onClick={toggleTheme}
      aria-label={themeLabel}
      title={themeLabel}
    >
      <i
        className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}
        aria-hidden="true"
      ></i>
    </button>
  );

  return (
    <nav>
      <div className="nav-top-row">
        <h2 className="nav-brand">NaijaIntern</h2>
        <img
          src={NaijaIntern}
          alt="NaijaIntern Logo"
          className="nav-logo"
        />


      {renderThemeToggle("mobile")}

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
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Discover</Link>
          </li>
          <li className={location.pathname === "/Guide" ? "active" : ""}>
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
            <Link to="/LoginSignup"  className={location.pathname === "/LoginSignup" ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;