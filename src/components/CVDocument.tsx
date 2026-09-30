import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";

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

// Same helper as CVPreview: add https:// when the student typed a
// bare domain like "linkedin.com/in/name", so the PDF link works.
const toHref = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

// Matches CVBuilder.css's three .cv-document template variants.
// h1 is #2563eb in every template (the base .cv-preview h1 rule isn't
// overridden by .professional or .minimal), so it's NOT per-theme.
const THEMES: Record<
  string,
  { background: string; text: string; leftBorder?: string; serif: boolean }
> = {
  professional: { background: "#ffffff", text: "#222222", serif: false },
  modern: { background: "#f8fbff", text: "#222222", leftBorder: "#2563eb", serif: false },
  minimal: { background: "#ffffff", text: "#111111", serif: true },
};

const H1_COLOR = "#2563eb"; // .cv-preview h1 { color: #2563eb } — same in all templates
const H2_COLOR = "#1f2937"; // .cv-preview h2 { color: #1f2937 }
const LINK_COLOR = "#2563eb"; // .cv-document a { color: #2563eb }

const styles = StyleSheet.create({
  page: {
    // .cv-preview { padding: 45px 50px } — px and pt are close enough at this scale
    paddingTop: 45,
    paddingBottom: 45,
    paddingLeft: 50,
    paddingRight: 50,
    fontSize: 14, // .cv-document { font-size: 14px }
    fontFamily: "Helvetica",
    color: "#222222",
    lineHeight: 1.5, // .cv-document { line-height: 1.5 }
  },
  name: {
    fontSize: 30, // .cv-document h1 { font-size: 30px }
    marginBottom: 8, // .cv-document h1 { margin-bottom: 8px }
    color: H1_COLOR,
    fontFamily: "Helvetica-Bold",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 2,
  },
  contactItem: {
    marginRight: 10,
  },
  link: {
    marginRight: 10,
    textDecoration: "none",
    color: LINK_COLOR,
  },
  divider: {
    // .cv-document hr { margin: 20px 0 }
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginVertical: 20,
  },
  h2: {
    fontSize: 18, // .cv-document h2 { font-size: 18px }
    marginTop: 25, // .cv-document h2 { margin-top: 25px }
    marginBottom: 6,
    color: H2_COLOR,
    fontFamily: "Helvetica-Bold",
  },
  paragraph: {
    marginBottom: 2,
  },
  schoolName: {
    fontSize: 16, // .cv-document h3 { font-size: 16px }
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  // Plain bulleted list, matching CVPreview's real <ul><li> (the blue
  // pill .skill-tag style belongs to the form's input area, not this).
  skillItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bullet: {
    width: 12,
  },
  certBlock: {
    marginBottom: 8,
  },
  certName: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
  leftBorderBar: {
    // .cv-document.modern { border-left: 8px solid #2563eb }
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 8,
    backgroundColor: "#2563eb",
  },
});

function CVDocument({ cvData, template }: Props) {
  const theme = THEMES[template] ?? THEMES.professional;
  const fontFamily = theme.serif ? "Times-Roman" : "Helvetica";
  const boldFont = theme.serif ? "Times-Bold" : "Helvetica-Bold";

  return (
    <Document>
      <Page
        size="A4"
        style={[
          styles.page,
          { fontFamily, backgroundColor: theme.background, color: theme.text },
        ]}
      >
        {theme.leftBorder && <View style={styles.leftBorderBar} />}

        {/* Header */}
        <Text style={[styles.name, { fontFamily: boldFont }]}>
          {cvData.fullName || "Your Name"}
        </Text>

        <View style={styles.contactRow}>
          {!!cvData.email && <Text style={styles.contactItem}>Email: {cvData.email}</Text>}
          {!!cvData.phone && <Text style={styles.contactItem}>Phone: {cvData.phone}</Text>}
          {!!cvData.location && (
            <Text style={styles.contactItem}>Location: {cvData.location}</Text>
          )}
        </View>

        <View style={styles.contactRow}>
          {!!cvData.linkedIn && (
            <Link src={toHref(cvData.linkedIn)} style={styles.link}>
              LinkedIn: {cvData.linkedIn}
            </Link>
          )}
          {!!cvData.github && (
            <Link src={toHref(cvData.github)} style={styles.link}>
              GitHub: {cvData.github}
            </Link>
          )}
          {!!cvData.portfolio && (
            <Link src={toHref(cvData.portfolio)} style={styles.link}>
              Portfolio: {cvData.portfolio}
            </Link>
          )}
        </View>

        <View style={styles.divider} />

        {/* Professional Summary */}
        <Text style={[styles.h2, { fontFamily: boldFont }]}>Professional Summary</Text>
        <Text style={styles.paragraph}>
          {cvData.summary || "Write a professional summary here."}
        </Text>

        <View style={styles.divider} />

        {/* Education */}
        <Text style={[styles.h2, { fontFamily: boldFont }]}>Education</Text>

        {!!cvData.school && (
          <Text style={[styles.schoolName, { fontFamily: boldFont }]}>{cvData.school}</Text>
        )}

        {(cvData.degree || cvData.course) && (
          <Text style={styles.paragraph}>
            {cvData.degree} {cvData.course}
          </Text>
        )}

        {(cvData.startYear || cvData.endYear) && (
          <Text style={styles.paragraph}>
            {cvData.startYear}
            {cvData.startYear && cvData.endYear ? " - " : ""}
            {cvData.endYear}
          </Text>
        )}

        {!!cvData.cgpa && <Text style={styles.paragraph}>CGPA: {cvData.cgpa}</Text>}

        <View style={styles.divider} />

        {/* Skills — plain bulleted list, matching CVPreview's <ul><li> */}
        <Text style={[styles.h2, { fontFamily: boldFont }]}>Skills</Text>

        {cvData.skills.length > 0 ? (
          cvData.skills.map((skill) => (
            <View key={skill} style={styles.skillItem}>
              <Text style={styles.bullet}>•</Text>
              <Text>{skill}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.paragraph}>No skills added yet.</Text>
        )}

        <View style={styles.divider} />

        {/* Certificates */}
        <Text style={[styles.h2, { fontFamily: boldFont }]}>Certificates</Text>

        {cvData.certificates
          .filter((c) => c.name || c.organization || c.year)
          .map((cert, index) => (
            <View key={index} style={styles.certBlock}>
              {!!cert.name && (
                <Text style={[styles.certName, { fontFamily: boldFont }]}>{cert.name}</Text>
              )}
              <Text>
                {cert.organization}
                {cert.organization && cert.year ? " • " : ""}
                {cert.year}
              </Text>
            </View>
          ))}
      </Page>
    </Document>
  );
}

export default CVDocument;