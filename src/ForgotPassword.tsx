import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./AuthSimple.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://backlink-6l9m.onrender.com/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong.");
        return;
      }

      setSent(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-auth-page">
      <div className="simple-auth-card">
        {sent ? (
          <>
            <h1>Check your email</h1>
            <p className="simple-auth-text">
              If an account exists for <strong>{email}</strong>, we've sent a
              link to reset your password. It expires in 30 minutes.
            </p>
            <p className="simple-auth-text">
              Can't see it? Check your spam folder.
            </p>
            <Link to="/LoginSignup" className="simple-auth-link">
              Back to sign in
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h1>Forgot your password?</h1>
            <p className="simple-auth-text">
              Enter the email you signed up with and we'll send you a link to
              choose a new password.
            </p>

            <label htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <button type="submit" className="simple-auth-btn" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <Link to="/LoginSignup" className="simple-auth-link">
              Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;