import { FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";

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


type InternshipCardProps = {
  internship: Internship;
  showDelete?: boolean;
  onDelete?: () => void;
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


function InternshipCard({ internship, showDelete, onDelete }: InternshipCardProps) {
  const logo = getCompanyLogo(internship.company?.website);

  const truncateText = (text: string, length: number) =>
  text.length > length ? text.slice(0, length) + "..." : text;


          return (
            <div className="card">

              {logo ? (
                <img src={logo} alt="company logo" />
              ) : (
                <div className="company-initials">
                  {internship.company?.name
                    ?.split(" ")
                    .map(w => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}

              <h3>{internship.title}</h3>

              <p className="company-info">
                {internship.company?.name}
              </p>

              <span className="location">
                {internship.location}
              </span>

              <p className="description">
                {truncateText(internship.description, 150)}
              </p>

              <hr />
               <div className="card-footer">
              <Link to={`/internship/${internship.id}`} className="view-details">
                View Details →
              </Link>

               {showDelete && (
              <button className="delete-btn" onClick={onDelete}>
              <FaTrash />
               </button>
               )}
              </div>

            </div>
          );

}

export default InternshipCard;