import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import "./InternshipDetails.css";
import SkeletonDetails from "./components/SkeletonDetails";

type Company = {
  name: string;
  website?: string;
  description?: string;
  contact_email?: string;
  application_url?: string;
};

type Internship = {
  id: number;
  title: string;
  description: string;
  location: string;
  company?: Company;
};

const extractSection = (text: string, keyword: string) => {
  const regex = new RegExp(
    `${keyword}:?([\\s\\S]*?)(?=ABOUT THE ROLE|RESPONSIBILITIES|REQUIREMENTS|ABOUT THE COMPANY|$)`,
    "i"
  );

  const match = text.match(regex);
  return match ? match[1].trim() : "";
};

// Only used for OLD-format descriptions that still have the
// "ABOUT THE ROLE: ... RESPONSIBILITIES: ..." structure baked in.
// New-format descriptions (the short "Indicative role..." line) just
// won't match anything here, which is fine -- see sections fallback below.
const parseDescription = (text: string) => ({
  role: extractSection(text, "ABOUT THE ROLE"),
  responsibilities: extractSection(text, "RESPONSIBILITIES"),
  requirements: extractSection(text, "REQUIREMENTS"),
});

const toBulletPoints = (text: string) => {
  if (!text) return [];

  return text
    .split("-")
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

const getCompanyLogo = (website?: string) => {
  if (!website) return null;

  try {
    const domain = new URL(website).hostname;
    return `https://img.logo.dev/${domain}?token=pk_OlDQz2BBTuy5iPonG-SpTA`;
  } catch {
    return null;
  }
};

const renderLogo = (company?: Company) => {
  const logo = getCompanyLogo(company?.website);

  if (logo) {
    return <img src={logo} alt={company?.name} />;
  }

  return (
    <div className="company-initials">
      {company?.name
        ?.split(" ")
        .map(w => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
  );
};

function InternshipDetails() {
  const { id } = useParams();

  const [collapsed, setCollapsed] = useState(false);

  const [internship, setInternship] = useState<Internship | null>(null);

  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  // This is the student's own confirmation that they've ALREADY sent
  // their application (by whatever means) and it should stop showing
  // up in their feed. It does not itself contact anyone -- see
  // handleContactByEmail / handleContactOnSite below for that.
  const handleApply = async () => {
    if (!token) {
      toast.error("Please sign in to apply for internships.");
      return;
    }

    try {
      const res = await fetch(
        `https://backlink-6l9m.onrender.com/internships/apply/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setApplied(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  // These just open the way to contact the company -- mail client or
  // their application page. They do NOT mark the internship as
  // applied; the student does that themselves once they're actually
  // done, using the Apply button above.
  const handleContactByEmail = () => {
    const email = internship?.company?.contact_email;
    if (!email) return;

    const subject = encodeURIComponent(
      `SIWES / Internship placement -- ${internship?.title}`
    );
    const body = encodeURIComponent(
      `Dear ${internship?.company?.name},\n\nI am seeking a SIWES placement in ${internship?.title}. Please find my CV attached.\n\nThank you.`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleContactOnSite = () => {
    const url = internship?.company?.application_url;
    if (!url) return;

    window.open(url, "_blank", "noreferrer");
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("Please sign in to save internships.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/internships/save/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setSaved(true);
      toast.success("Internship saved!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    const fetchInternship = async () => {
      setLoading(true);

      try {
        const res = await fetch(`https://backlink-6l9m.onrender.com/internships/${id}`);
        const data = await res.json();

        setInternship(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  if (loading) {
    return (
      <div className="details-layout">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main
          className="details-content"
          style={{
            marginLeft: collapsed ? "80px" : "260px",
            transition: ".3s",
          }}
        >
          <SkeletonDetails />
        </main>
      </div>
    );
  }

  if (!internship) return <h2>Internship not found.</h2>;

  const sections = parseDescription(internship.description);
  const hasResponsibilities = toBulletPoints(sections.responsibilities).length > 0;
  const hasRequirements = toBulletPoints(sections.requirements).length > 0;

  const email = internship.company?.contact_email;
  const applicationUrl = internship.company?.application_url;
  const canApply = Boolean(email || applicationUrl);

  return (
    <div className="details-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className="details-content"
        style={{
          marginLeft: collapsed ? "80px" : "260px",
          transition: ".3s",
        }}
      >
        <div className="details-header">
          <div className="company-logo">{renderLogo(internship.company)}</div>

          <div className="header-info">
            <h1>{internship.title}</h1>
            <h3>{internship.company?.name}</h3>
            <p>📍 {internship.location}</p>
          </div>
        </div>

        <div className="action-buttons">
          {email && (
            <button className="contact-btn" onClick={handleContactByEmail}>
              ✉️ Email {internship.company?.name}
            </button>
          )}

          {!email && applicationUrl && (
            <button className="contact-btn" onClick={handleContactOnSite}>
              🔗 Apply on Company's Site
            </button>
          )}

          {!canApply && (
            <button className="contact-btn" disabled>
              Not accepting applications yet
            </button>
          )}

          <button className="apply-btn" onClick={handleApply} disabled={applied}>
            {applied ? "Applied ✓" : "Mark as Applied"}
          </button>

          <button className="save-btn" onClick={handleSave} disabled={saved}>
            {saved ? "Saved ✓" : "Save Internship"}
          </button>
        </div>

        <div className="details-card">
          <h2>About this Internship</h2>
          <p>{sections.role || internship.description}</p>
        </div>

        {hasResponsibilities && (
          <div className="details-card">
            <h2>Responsibilities</h2>
            <ul className="bullet-list">
              {toBulletPoints(sections.responsibilities).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {hasRequirements && (
          <div className="details-card">
            <h2>Requirements</h2>
            <ul className="bullet-list">
              {toBulletPoints(sections.requirements).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {internship.company?.description && (
          <div className="details-card">
            <h2>About the Company</h2>
            <p>{internship.company.description}</p>
          </div>
        )}

        {internship.company?.website && (
          <div className="details-card">
            <h2>Company Website</h2>
            <a href={internship.company.website} target="_blank" rel="noreferrer">
              🌐 {internship.company.website}
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

export default InternshipDetails;