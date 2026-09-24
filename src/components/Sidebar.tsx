import { NavLink, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Sidebar.css";
import { useState } from "react";



type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

function Sidebar({ collapsed, setCollapsed }: SidebarProps) {

  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

const isLoggedIn = !!localStorage.getItem("token");

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  toast.success("Logged out successfully.");

  navigate("/");
};

const handleProtectedRoute = (path: string, feature: string): boolean => {
  if (!isLoggedIn) {
    toast.error(`Please sign in to access ${feature}.`);
    return false;
  }

  navigate(path);
  return true;
};

const handleMobileClose = () => {
  if (window.innerWidth <= 768) {
    setMobileOpen(false);
  }
};

  return (
  <>
   <button
    className="mobile-menu-btn"
    onClick={() => setMobileOpen(prev => !prev)}
    aria-label="Toggle navigation menu"
>
    ☰
</button>
    

    {mobileOpen && (
      <div
        className="sidebar-overlay"
        onClick={() => setMobileOpen(false)}
      />
    )}

    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
    >




      
      {/* Header Container */}
      <div className="sidebar-header">
        <button
  className="collapse-btn"
  onClick={() => setCollapsed(!collapsed)}
>
  ☰
</button>

        <div className="sidebar-logo">
          <Link to ="/" className="sidebar-link">
          <i className="fas fa-briefcase"></i>
          <span className="label fade-text">Discover</span>
          
          </Link>
        </div>
      </div>

      {/* DASHBOARD SECTION */}
      <div className="sidebar-section">
        <h4 className="section-title fade-text">DASHBOARD</h4>
        <NavLink to="/opportunities" className="sidebar-link" onClick={handleMobileClose}>
          <i className="fas fa-building"></i>
          <span className="label fade-text">Opportunities</span>
          <span className="tooltip">Opportunities</span>
          
        </NavLink>
      </div>

      {/* ACTIVITY SECTION */}
      <div className="sidebar-section">
        <h4 className="section-title fade-text">MY ACTIVITY</h4>

    <button
    className="sidebar-link"
    onClick={() => {
        handleProtectedRoute(
            "/Saved",
            "your saved internships"
        );
    }}
>
          <i className="fas fa-bookmark"></i>
          <span className="label fade-text">Saved</span>
          <span className="tooltip">Saved</span>
        </button>

       <button
    className="sidebar-link"
    onClick={() => {
        handleProtectedRoute(
            "/Applied",
            "your applied internships"
        );
    }}
>
          <i className="fas fa-check-circle"></i>
          <span className="label fade-text">Applied</span>
          <span className="tooltip">Applied</span>
        </button>

{isLoggedIn && (
  <NavLink to="/cv-builder" className="sidebar-link" onClick={handleMobileClose}>
    <i className="fas fa-file-lines"></i>
    <span className="label fade-text">CV Builder</span>
    <span className="tooltip">CV Builder</span>
  </NavLink>
)}
      </div>

      {/* ACCOUNT SECTION */}
      <div className="sidebar-section">
        <h4 className="section-title fade-text">ACCOUNT</h4>

       {isLoggedIn && (
  <NavLink to="/Profile" className="sidebar-link" onClick={handleMobileClose}>
    <i className="fas fa-user"></i>
    <span className="label fade-text">Profile</span>
    <span className="tooltip">Profile</span>
  </NavLink>
)}

       {isLoggedIn ? (
  <button className="sidebar-link" onClick={handleLogout}>
    <i className="fas fa-right-from-bracket"></i>
    <span className="label fade-text">Logout</span>
    <span className="tooltip">Logout</span>
  </button>
) : (
  <NavLink to="/LoginSignup" className="sidebar-link" onClick={handleMobileClose}>
    <i className="fas fa-right-to-bracket"></i>
    <span className="label fade-text">Get Started</span>
    <span className="tooltip">Get Started</span>
  </NavLink>
)}
      </div>

    </aside>
  </>
  );
}


export default Sidebar;