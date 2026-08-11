import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./CVBuilder.css";
import CVPreview from "./CVPreview";
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



function CVBuilder() {
   const [cvData, setCvData] = useState<CVData>({
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

  skills:[],

  certificates: [
  {
    name: "",
    organization: "",
    year: ""
  }
]
});

const [template, setTemplate] = useState("professional");

const [skillInput, setSkillInput] = useState("");
const [collapsed, setCollapsed] = useState(false);
const cvRef = useRef<HTMLDivElement>(null);


const handleDownload = async () => {
  if (!cvRef.current) return;

  try {
    const canvas = await html2canvas(cvRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = pdfWidth;
    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pdfHeight;
    }

    const fileName = cvData.fullName
      ? `${cvData.fullName.replace(/\s+/g, "_")}_CV.pdf`
      : "My_CV.pdf";

    pdf.save(fileName);

  } catch (error) {
    console.error("PDF generation failed:", error);
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


const suggestedSkills =
  skillSuggestions[cvData.course.toLowerCase()] || [];


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

<input
  type="text"
  name="fullName"
  placeholder="Full Name"
  value={cvData.fullName}
  onChange={handleChange}
/>

    <input
  type="email"
  name="email"
  placeholder="Email Address"
  value={cvData.email}
  onChange={handleChange}
/>

  <input
  type="number"
  name="phone"
  placeholder="Phone Number"
  value={cvData.phone}
  onChange={handleChange}
/>

            <input
  type="text"
  name="location"
  placeholder="Location"
  value={cvData.location}
  onChange={handleChange}
/>

            <input
  type="text"
  name="linkedIn"
  placeholder="LinkedIn"
  value={cvData.linkedIn}
  onChange={handleChange}
/>

            <input
  type="text"
  name="github"
  placeholder="GitHub"
  value={cvData.github}
  onChange={handleChange}
/>

<input
  type="text"
  name="portfolio"
  placeholder="Portfolio"
  value={cvData.portfolio}
  onChange={handleChange}
/>

<h3>Professional Summary</h3>

<textarea
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

<input
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
        onClick={() => removeSkill(skill)}
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
      value={cert.name}
      onChange={(e) =>
        handleCertificateChange(
          index,
          "name",
          e.target.value
        )
      }
    />

    <input
      type="text"
      placeholder="Organization"
      value={cert.organization}
      onChange={(e) =>
        handleCertificateChange(
          index,
          "organization",
          e.target.value
        )
      }
    />

    <input
      type="number"
      placeholder="Year"
      value={cert.year}
      onChange={(e) =>
        handleCertificateChange(
          index,
          "year",
          e.target.value
        )
      }
    />

  </div>

))}

<button
  type="button"
  className="add-btn"
  onClick={addCertificate}
>
  + Add Certificate
</button>





<div className="date-row">

  <div className="form-group">
    <label>Start Year</label>
    <input
      type="number"
      value={cvData.startYear}
      onChange={(e) =>
        setCvData({
          ...cvData,
          startYear: e.target.value,
        })
      }
    />
  </div>

  <div className="form-group">
    <label>End Year</label>
    <input
      type="number"
      value={cvData.endYear}
      onChange={(e) =>
        setCvData({
          ...cvData,
          endYear: e.target.value,
        })
      }
    />
  </div>

</div>

<input
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

        <div ref={cvRef} className="cv-preview">
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