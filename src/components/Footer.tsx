import "./Footer.css";

const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSej7HttY_k3u1750rZBRMvlpOtyrCrOOFgfGSMuven0REBfpA/viewform";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-feedback">
        <h4>Have a problem or feedback?</h4>
        <a
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-feedback-link"
        >
          <i className="fas fa-comment-dots" aria-hidden="true"></i> Report a problem
        </a>
      </div>

      <div className="footer-privacy">
        <h4>Privacy</h4>
        <p>
          We collect the information you give us, like your account details and
          your activity on the site, to run NaijaIntern. We don't sell your
          data.
        </p>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} NaijaIntern
      </p>
    </footer>
  );
}

export default Footer;