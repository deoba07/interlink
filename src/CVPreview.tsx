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


type Props = {
  cvData: CVData;
  template: string;
};

// Students often type "linkedin.com/in/name" without the protocol --
// on its own that renders as a broken relative link, so this adds
// https:// whenever it's missing.
const toHref = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

function CVPreview({
  cvData,
  template,
}: Props) {
  return (

   <div className={`cv-document ${template}`}>

      {/* Header */}
      <h1>{cvData.fullName || "Your Name"}</h1>

      <p>{cvData.email || "your@email.com"}</p>
      {cvData.phone && <p>Phone: {cvData.phone}</p>}
      {cvData.location && <p>Location: {cvData.location}</p>}

      {cvData.linkedIn && (
        <p>
          LinkedIn:{" "}
          <a href={toHref(cvData.linkedIn)} target="_blank" rel="noreferrer">
            {cvData.linkedIn}
          </a>
        </p>
      )}

      {cvData.github && (
        <p>
          GitHub:{" "}
          <a href={toHref(cvData.github)} target="_blank" rel="noreferrer">
            {cvData.github}
          </a>
        </p>
      )}

      {cvData.portfolio && (
        <p>
          Portfolio:{" "}
          <a href={toHref(cvData.portfolio)} target="_blank" rel="noreferrer">
            {cvData.portfolio}
          </a>
        </p>
      )}

      <hr />

      {/* Professional Summary */}
      <h2>Professional Summary</h2>

      <p>
        {cvData.summary || "Write a professional summary here."}
      </p>

      <hr />

      {/* Education */}
      <h2>Education</h2>

      <h3>{cvData.school}</h3>

      <p>
        {cvData.degree} {cvData.course}
      </p>

      <p>
        {cvData.startYear}
        {cvData.startYear && cvData.endYear ? " - " : ""}
        {cvData.endYear}
      </p>

      {cvData.cgpa && (
        <p>
          CGPA: {cvData.cgpa}
        </p>
      )}

      <hr />

      {/* Skills */}
      <h2>Skills</h2>

      {cvData.skills.length > 0 ? (
        <ul>
          {cvData.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p>No skills added yet.</p>
      )}

      <hr />

       <h2>Certificates</h2>

  {cvData.certificates.map((cert, index) => (

  <div key={index}>

    <strong>{cert.name}</strong>

    <p>
      {cert.organization}
      {cert.organization && cert.year ? " • " : ""}
      {cert.year}
    </p>

  </div>

))}

    </div>
  );
}

export default CVPreview;