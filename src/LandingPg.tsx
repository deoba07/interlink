import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import InternshipCard from "./InternshipCard";
import SkeletonCard from "./components/SkeletonCard";

type Company = {
  id: number;
  name: string;
  website?: string;
};

type Internship = {
  id: number;
  title: string;
  description: string;
  location: string;
  company?: Company;
};



function LandingPg() {


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

  navigate("/CVBuilder");
};


  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>([]);

  

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchInternships = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://backlink-6l9m.onrender.com/internships/with-companies");
      const data = await res.json();

      setFeaturedInternships(data.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchInternships();
}, []);

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();

  console.log("HANDLE SEARCH FIRED");

  const trimmedSearch = search.trim();
  const trimmedLocation = location.trim();

  console.log("Search:", trimmedSearch);
  console.log("Location:", trimmedLocation);

  if (!trimmedSearch && !trimmedLocation) {
    console.log("EMPTY SEARCH — SHOULD STOP");
    toast.error("Please enter a course, role, or location.");
    return;
  }

  console.log("VALID SEARCH — NAVIGATING");

  navigate(
    `/opportunities?search=${encodeURIComponent(trimmedSearch)}&location=${encodeURIComponent(trimmedLocation)}`
  );
};


  return (
    <div className="landing-container">

      <nav>
  <h2 className="nav-brand">
    <Link to="/">Career Command Center</Link>
  </h2>

  <ul className="nav-menu">
    <li>
      <Link to="/Discover">Discover</Link>
    </li>

    <li>
      <Link to="/Guide">Guide</Link>
    </li>

    <li>
      <button
        className="nav-button"
        onClick={handleCVBuilder}
      >
        CV Builder
      </button>
    </li>
  </ul>

  <div className="nav-sign">
    {isLoggedIn ? (
      <button
        className="nav-button logout-btn-nav"
        onClick={handleLogout}
      >
        Logout
      </button>
    ) : (
      <Link to="/LoginSignup">Get Started</Link>
    )}
  </div>
</nav>

      
      <div className="hero-section">

        <span className="text-spanh">
          Trusted by Students all over Nigeria
        </span>

        <h1>Find Internship Opportunities That</h1>
        <h1>Match Your Course</h1>

        <p>
          Nigeria's premier bridge between students and top-tier companies,
          providing precision matching for the next generation of professionals.
        </p>

        {/* SEARCH BAR (UNCHANGED CLASSNAMES) */}
        <form className="search-bar" onSubmit={handleSearch}>

          <div className="input-group">
            <span className="icon">🎓</span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Your course of study"
            />
          </div>

          <div className="input-group">
            <span className="icon">📍</span>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Preferred Location"
            />
          </div>

          <button className="btn-search"
           type="submit">
            Search Internship
          </button>

        </form>
      </div>

      
      <div className="opportunities-header">
        <div>
          <h3>Featured Opportunities</h3>
          <p>Selected high-impact roles for your career launch</p>
        </div>

        <Link to="/opportunities" className="view-all-link">
          View Opportunities →
        </Link>
      </div>

      <div className="featured-grid">

      {loading ? (
    Array.from({ length: 3 }).map((_, index) => (
      <SkeletonCard key={index} />
    ))
     ) : (
    featuredInternships.map((internship) => (
      <InternshipCard
        key={internship.id}
        internship={internship}
      />
    ))
  )}

</div>

      <div className="stats-wrapper">

        <div className="stat-box">
          <i className="fas fa-briefcase"></i>
          <h1>200+</h1>
          <p>Internship Opportunites</p>
        </div>

        <div className="stat-box">
          <i className="fas fa-file-alt"></i>
          <h1>50+</h1>
          <p>Partner Companies</p>
        </div>

        <div className="stat-box">
          <i className="fas fa-users"></i>
          <h1>36</h1>
          <p>States Covered</p>
        </div>

        <div className="stat-box">
          <i className="fas fa-trophy"></i>
          <h1>700+</h1>
          <p>Students connected</p>
        </div>

      </div>

    </div>
  );
}

export default LandingPg;