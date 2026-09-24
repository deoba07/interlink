import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import InternshipCard from "./InternshipCard";
import SkeletonCard from "./components/SkeletonCard";
import Navbar from "./components/Navbar";

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

      <Navbar />

      
      <div className="hero-section">

        <span className="text-spanh">
          Trusted by Students all over Nigeria
        </span>

        <h1>Find Internship Opportunities That Match Your Course</h1>
        

        <p>
          Every year, thousands of Nigerian students search for internships that fit their course of study.
       NaijaIntern makes that search easier connecting you to real opportunities across the country, matched to what you're studying.
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
            Search Internships
          </button>

        </form>
      </div>

      
      <div className="opportunities-header">
        <div>
          <h3>Featured Opportunities</h3>
          <p>Hand-picked roles to get you started</p>
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
          <p>Internship Opportunities</p>
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