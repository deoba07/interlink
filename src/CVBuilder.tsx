import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { toast } from "react-hot-toast";
import "./CVBuilder.css";
import CVPreview from "./CVPreview";
import CVDocument from "./components/CVDocument";
import Sidebar from "./components/Sidebar";


type Certificate = {
  name: string;
  organization: string;
  year: string;
};

type CVData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  github: string;
  portfolio: string;

  summary: string;

  school: string;
  degree: string;
  course: string;
  startYear: string;
  endYear: string;
  cgpa: string;

  skills: string[];

  certificates: Certificate[];
};

const CV_DRAFT_KEY = "naijaintern_cv_draft";

type CVDraft = {
  cvData: CVData;
  template: string;
};

const defaultCvData: CVData = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  github: "",
  portfolio: "",

  summary: "",

  school: "",
  degree: "",
  course: "",
  startYear: "",
  endYear: "",
  cgpa: "",

  skills: [],

  certificates: [
    {
      name: "",
      organization: "",
      year: "",
    },
  ],
};

const loadDraft = (): CVDraft | null => {
  try {
    const raw = localStorage.getItem(CV_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialDraft = loadDraft();



function CVBuilder() {
  const [cvData, setCvData] = useState<CVData>(
    initialDraft?.cvData ?? defaultCvData
  );

  const [template, setTemplate] = useState(
    initialDraft?.template ?? "professional"
  );

  const [skillInput, setSkillInput] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  

  // Autosave the draft every time anything changes, so refreshing
  // or coming back later doesn't lose progress.
  useEffect(() => {
    try {
      localStorage.setItem(
        CV_DRAFT_KEY,
        JSON.stringify({ cvData, template })
      );
    } catch (err) {
      console.error(err);
    }
  }, [cvData, template]);

  // Pre-fill name/email from the logged-in account, but only into
  // fields that are still empty -- never overwrite anything the
  // user already typed or restored from a saved draft.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;

      const user = JSON.parse(raw);

      setCvData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);


const handleDownload = async () => {
  try {
    const blob = await pdf(
      <CVDocument cvData={cvData} template={template} />
    ).toBlob();

    const fileName = cvData.fullName
      ? `${cvData.fullName.replace(/\s+/g, "_")}_CV.pdf`
      : "My_CV.pdf";

    const file = new File([blob], fileName, { type: "application/pdf" });

    const nav = navigator as Navigator & {
      canShare?: (data: { files: File[] }) => boolean;
      share?: (data: { files: File[]; title?: string }) => Promise<void>;
    };

    if (nav.canShare?.({ files: [file] }) && nav.share) {
      try {
        await nav.share({ files: [file], title: fileName });
        toast.success("CV ready, saved from the share sheet.");
        return;
      } catch (shareErr) {
        // User tapped "Cancel" on the share sheet -- not a real error,
        // so don't show a failure toast, just stop quietly.
        if ((shareErr as Error).name === "AbortError") return;
        throw shareErr;
      }
    }

    // Desktop fallback: normal blob-link download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CV downloaded successfully.");
  } catch (error) {
    console.error("PDF generation failed:", error);
    toast.error("Couldn't generate the PDF. Please try again.");
  }
};

const skillSuggestions: Record<string, string[]> = {
  "computer science": [
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "Python",
    "Git",
    "SQL",
    "MongoDB",
  ],

  law: [
    "Legal Research",
    "Negotiation",
    "Contract Drafting",
    "Litigation",
    "Communication",
  ],

  nursing: [
    "Patient Care",
    "Vital Signs",
    "Clinical Documentation",
    "Medication Administration",
    "Teamwork",
  ],

  marketing: [
    "SEO",
    "Google Analytics",
    "Canva",
    "Content Writing",
    "Social Media",
  ],

  accounting: [
    "Excel",
    "QuickBooks",
    "Financial Analysis",
    "Power BI",
    "Bookkeeping",
  ],
};

// Maps a wider range of real course names to the skill-suggestion
// keys above, so "Software Engineering" or "Information Technology"
// still gets useful suggestions instead of an empty list.
const courseAliasMap: Record<string, string[]> = {
  "computer science": [
    "computer science",
    "software engineering",
    "software development",
    "computer engineering",
    "information technology",
    "information systems",
    "computing",
    "cs",
  ],
  law: ["law", "llb", "legal studies"],
  nursing: ["nursing", "nursing science"],
  marketing: ["marketing", "digital marketing"],
  accounting: ["accounting", "accountancy", "finance"],
};

const getSuggestedSkills = (course: string): string[] => {
  const normalized = course.trim().toLowerCase();
  if (!normalized) return [];

  for (const key of Object.keys(courseAliasMap)) {
    const aliases = courseAliasMap[key];
    const matches = aliases.some(
      (alias) =>
        normalized.includes(alias) || alias.includes(normalized)
    );

    if (matches) {
      return skillSuggestions[key] || [];
    }
  }

  return [];
};

const suggestedSkills = getSuggestedSkills(cvData.course);


  const addSkill = (skill: string) => {
  const trimmed = skill.trim();

  if (
    trimmed &&
    !cvData.skills.includes(trimmed)
  ) {
    setCvData({
      ...cvData,
      skills: [...cvData.skills, trimmed],
    });
  }

  setSkillInput("");
};

const removeSkill = (skill: string) => {
  setCvData({
    ...cvData,
    skills: cvData.skills.filter(
      (s) => s !== skill
    ),
  });
};
    const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setCvData({
    ...cvData,
    [e.target.name]: e.target.value,
  });
};


const handleCertificateChange = (
  index: number,
  field: string,
  value: string
) => {
  const updated = [...cvData.certificates];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setCvData({
    ...cvData,
    certificates: updated,
  });
};


const addCertificate = () => {
  setCvData({
    ...cvData,
    certificates: [
      ...cvData.certificates,
      {
        name: "",
        organization: "",
        year: "",
      },
    ],
  });
};

const removeCertificate = (index: number) => {
  setCvData((prev) => ({
    ...prev,
    certificates: prev.certificates.filter((_, i) => i !== index),
  }));
};

  return (
<div className="cv-layout">

    <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
    />

    <main
        className="cv-page"
        style={{
            marginLeft: collapsed ? "80px" : "260px",
            transition: ".3s ease"
        }}
    >
      <div className="builder-badge">
    Internship CV Builder
</div>

      {/* HEADER */}
<div className="cv-header">

  <div className="header-content">
    <h2>CV Builder</h2>
    <p>
      Build a professional internship-ready CV and download it as a PDF.
    </p>
    <p className="draft-note">
      Your progress is saved automatically on this device.
    </p>
  </div>

  <button
  type="button"
  className="download-btn"
  onClick={handleDownload}
>
  Download CV
</button>

</div>

      {/* MAIN CONTENT */}
      <div className="cv-container">

        {/* LEFT SIDE */}
        <div className="cv-form">

          <h2>CV Builder</h2>
          <p>
            Fill in your details and watch your CV update instantly.
          </p>

          <div className="form-section">


            <div className="template-selector">

  <h3>Choose CV Template</h3>

  <div className="template-buttons">

    <button
      type="button"
      className={template === "professional" ? "active" : ""}
      onClick={() => setTemplate("professional")}
    >
      Professional
    </button>

    <button
      type="button"
      className={template === "modern" ? "active" : ""}
      onClick={() => setTemplate("modern")}
    >
      Modern
    </button>

    <button
      type="button"
      className={template === "minimal" ? "active" : ""}
      onClick={() => setTemplate("minimal")}
    >
      Minimal
    </button>

  </div>

</div>

          <h3>Personal Information</h3>

<label className="sr-only" htmlFor="fullName">Full Name</label>
<input
  id="fullName"
  type="text"
  name="fullName"
  placeholder="Full Name"
  value={cvData.fullName}
  onChange={handleChange}
/>

<label className="sr-only" htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  name="email"
  placeholder="Email Address"
  value={cvData.email}
  onChange={handleChange}
/>

<label className="sr-only" htmlFor="phone">Phone Number</label>
<input
  id="phone"
  type="tel"
  name="phone"
  placeholder="Phone Number"
  value={cvData.phone}
  onChange={handleChange}
/>

<label className="sr-only" htmlFor="location">Location</label>
<input
  id="location"
  type="text"
  name="location"
  placeholder="Location"
  value={cvData.location}
  onChange={handleChange}
/>

<label className="sr-only" htmlFor="linkedIn">LinkedIn</label>
<input
  id="linkedIn"
  type="text"
  name="linkedIn"
  placeholder="LinkedIn"
  value={cvData.linkedIn}
  onChange={handleChange}
/>

<label className="sr-only" htmlFor="github">GitHub</label>
<input
  id="github"
  type="text"
  name="github"
  placeholder="GitHub"
  value={cvData.github}
  onChange={handleChange}
/>

<label htmlFor="portfolio">Portfolio</label>
<input
  id="portfolio"
  type="text"
  name="portfolio"
  placeholder="Portfolio"
  value={cvData.portfolio}
  onChange={handleChange}
/>

<h3>Professional Summary</h3>

<label className="sr-only" htmlFor="summary">Professional Summary</label>
<textarea
  id="summary"
  name="summary"
  placeholder="Write a short summary about yourself..."
  value={cvData.summary}
  onChange={(e) =>
    setCvData({
      ...cvData,
      summary: e.target.value,
    })
  }
/>


<h3>Education</h3>

<input
  type="text"
  name="school"
  placeholder="University / Institution"
  value={cvData.school}
  onChange={handleChange}
/>

<input
  type="text"
  name="degree"
  placeholder="Degree (e.g. B.Sc)"
  value={cvData.degree}
  onChange={handleChange}
/>

<input
  type="text"
  name="course"
  placeholder="Course of Study"
  value={cvData.course}
  onChange={handleChange}
/>


<h3>Skills</h3>

<label className="sr-only" htmlFor="skill">Skills</label>
<input
  id="skill"
  type="text"
  placeholder="Type a skill and press Enter"
  value={skillInput}
  onChange={(e) => setSkillInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(skillInput);
    }
  }}
/>



<div className="skills-list">

  {cvData.skills.map((skill) => (

    <div
      key={skill}
      className="skill-tag"
    >
      {skill}

      <span
  role="button"
  tabIndex={0}
  aria-label={`Remove ${skill}`}
  onClick={() => removeSkill(skill)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      removeSkill(skill);
    }
  }}
>
  ×
</span>

    </div>

  ))}

</div>


<div className="suggestions">

  {suggestedSkills.map((skill) => (

    <button
      type="button"
      key={skill}
      className="suggestion-btn"
      onClick={() => addSkill(skill)}
    >
      + {skill}
    </button>

  ))}

</div>

<h3>Certificates</h3>

{cvData.certificates.map((cert, index) => (

  <div
    key={index}
    className="certificate-box"
  >

    <input
  type="text"
  placeholder="Certificate Name"
  aria-label={`Certificate ${index + 1} name`}
  value={cert.name}
  onChange={(e) =>
    handleCertificateChange(index, "name", e.target.value)
  }
/>

<input
  type="text"
  placeholder="Organization"
  aria-label={`Certificate ${index + 1} organization`}
  value={cert.organization}
  onChange={(e) =>
    handleCertificateChange(index, "organization", e.target.value)
  }
/>

<input
  type="number"
  placeholder="Year"
  aria-label={`Certificate ${index + 1} year`}
  value={cert.year}
  onChange={(e) =>
    handleCertificateChange(index, "year", e.target.value)
  }
/>

    {cvData.certificates.length > 1 && (
      <button
        type="button"
        className="remove-cert-btn"
        onClick={() => removeCertificate(index)}
        aria-label="Remove this certificate"
      >
        Remove
      </button>
    )}

  </div>

))}

<button
  type="button"
  className="add-btn"
  onClick={addCertificate}
>
  + Add Certificate
</button>





<div className="form-group">
  <label className="sr-only" htmlFor="startYear">Start Year</label>
  <input
    id="startYear"
    type="number"
    value={cvData.startYear}
    onChange={(e) =>
      setCvData({ ...cvData, startYear: e.target.value })
    }
  />
</div>

<div className="form-group">
  <label className="sr-only" htmlFor="endYear">End Year</label>
  <input
    id="endYear"
    type="number"
    value={cvData.endYear}
    onChange={(e) =>
      setCvData({ ...cvData, endYear: e.target.value })
    }
  />
</div>

<label className="sr-only" htmlFor="cgpa">CGPA (Optional)</label>
<input
  id="cgpa"
  type="text"
  name="cgpa"
  placeholder="CGPA (Optional)"
  value={cvData.cgpa}
  onChange={handleChange}
/>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="cv-preview-container">

        <div className="cv-preview">
        <CVPreview
        cvData={cvData}
        template={template}
        />
     </div>

        </div>

      </div>

        </main>

</div>
);
}

export default CVBuilder;