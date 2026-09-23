import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import InternshipCard from "./InternshipCard";
import { toast } from "react-hot-toast";
import { FaRegCheckCircle } from "react-icons/fa";
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
  field_tags?: string;
  company?: Company;
};

function Applied() {
  const [appliedInternships, setAppliedInternships] = useState<Internship[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAppliedInternships = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://backlink-6l9m.onrender.com/internships/applied", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Applied internships:", data);

      setAppliedInternships(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAppliedInternships([]);
    } finally {
      setLoading(false);
    }
  };

  fetchAppliedInternships();
}, []);

   const handleDelete = async (id: number) => {
  try {
    const res = await fetch(`https://backlink-6l9m.onrender.com/applied/${id}`, {
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

    // Remove it from the UI immediately
    setAppliedInternships((prev) =>
      prev.filter((internship) => internship.id !== id)
    );

    toast.success("Internship removed from applied.");

 } catch (err) {
  console.error(err);
  toast.error("Something went wrong.");
}
};

  return (
    <div className="opportunities-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className="opportunities-content"
        style={{
          marginLeft: collapsed ? "80px" : "260px",
          transition: "0.3s ease",
        }}
      >
        <h2>Applied Internships</h2>

       {loading ? (
  <div className="cards-grid">
    {Array.from({ length: 6 }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
) : appliedInternships.length === 0 ? (
  <div className="empty-state">
    <FaRegCheckCircle className="empty-icon" />
    <h3>No applied internships yet.</h3>
    <p>
      Apply to internships you're interested in and they'll appear here.
    </p>
  </div>
) : (
  <div className="cards-grid">
    {appliedInternships.map((internship) => (
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

export default Applied;