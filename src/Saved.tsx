import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import InternshipCard from "./InternshipCard";
import { toast } from "react-hot-toast";
import { FaRegBookmark } from "react-icons/fa";
import SkeletonCard from "./components/SkeletonCard";
import "./Saved.css";

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
  field_tags?: string;
  company?: Company;
};

function Saved() {
  const [savedInternships, setSavedInternships] = useState<Internship[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedInternships = async () => {
      setLoading(true);

      try {
        const res = await fetch("http://localhost:3000/internships/saved", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setSavedInternships(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSavedInternships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedInternships();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/internships/save/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setSavedInternships((prev) =>
        prev.filter((internship) => internship.id !== id)
      );

      toast.success("Internship removed from saved.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="opportunities-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Class added instead of inline styles */}
      <main className={`opportunities-content ${collapsed ? "collapsed" : ""}`}>
        <h2>Saved Internships</h2>
        {loading ? (
          <div className="cards-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : savedInternships.length === 0 ? (
          <div className="empty-state">
            <FaRegBookmark className="empty-icon" />
            <h3>No saved internships yet.</h3>
            <p>Save internships you're interested in and they'll appear here.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {savedInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                showDelete
                onDelete={() => handleDelete(internship.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Saved;