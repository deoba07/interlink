import { useEffect, useState } from "react";
import {  useNavigate,useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./Opportunities.css";
import { toast } from "react-hot-toast";
import InternshipCard from "./InternshipCard";
import SkeletonCard from "./components/SkeletonCard";

type Company = {
  id:number;
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

function Opportunities() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [search, setSearch] = useState("");
  const [locationValue, setLocationValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(true);


  const itemsPerPage = 12;

  
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ SAFE FETCH (NO CRASH)
  useEffect(() => {
  const fetchInternships = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams(location.search);

      const searchQuery = params.get("search") || "";
      const locationQuery = params.get("location") || "";

      let url = "http://localhost:3000/internships/with-companies";

      if (searchQuery || locationQuery) {
        url = `http://localhost:3000/internships/search?q=${encodeURIComponent(
          searchQuery
        )}&location=${encodeURIComponent(locationQuery)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      setInternships(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  fetchInternships();
}, [location.search]);


useEffect(() => {
  const params = new URLSearchParams(location.search);

  setSearch(params.get("search") || "");
  setLocationValue(params.get("location") || "");
}, [location.search]);

  

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();

  const trimmedSearch = search.trim();
  const trimmedLocation = locationValue.trim();

  if (!trimmedSearch && !trimmedLocation) {
    toast.error("Please enter a course, role, or location.");
    return;
  }

  if (trimmedSearch && trimmedSearch.length < 2) {
    toast.error("Please enter a more specific search.");
    return;
  }

  setCurrentPage(1);

  navigate(
    `/opportunities?search=${encodeURIComponent(trimmedSearch)}&location=${encodeURIComponent(trimmedLocation)}`
  );
};

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems =
    Array.isArray(internships)
      ? internships.slice(indexOfFirst, indexOfLast)
      : [];

  const totalPages = Math.max(
  1,
  Math.ceil(internships.length / itemsPerPage)
);

  return (
    <div className="opportunities-layout">

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
  className="opportunities-content"
  style={{
    marginLeft: collapsed ? "80px" : "260px",
    transition: "0.3s ease"
  }}
>

  


        {/* SEARCH BAR (UNCHANGED CLASSNAME) */}
        <form className="search-bar" onSubmit={handleSearch}>

          <input
            type="text"
            placeholder="Search course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location..."
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
          />

          <button type="submit" className="btn-search">
            Search
          </button>

        </form>

        {/* CARDS GRID */}
        <div className="cards-grid">

{loading ? (
  Array.from({ length: itemsPerPage }).map((_, index) => (
    <SkeletonCard key={index} />
  ))
) : currentItems.length === 0 ? (
  <div className="no-results">
  <div className="no-results-icon">🔍</div>

  <h3>No internships found</h3>

  <p>
    We couldn't find any internships matching your search.
    Try a different course, department, role, or location.
  </p>
</div>
) : (
  currentItems.map((internship) => (
    <InternshipCard
      key={internship.id}
      internship={internship}
    />
  ))
)}


{/*}
{!loading && internships.length > 0 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(p => p - 1)}
    >
      Prev
    </button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(p => p + 1)}
    >
      Next
    </button>
  </div>
)}
  */}
        

        </div>

        {/* PAGINATION */}
        <div className="pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>

        </div>

      </main>
    </div>
  );
}

export default Opportunities;