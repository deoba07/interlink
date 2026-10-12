import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./AuthSimple.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://backlink-6l9m.onrender.com/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong.");
        return;
      }

      toast.success("Password updated. Please sign in.");
      navigate("/LoginSignup");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="simple-auth-page">
        <div className="simple-auth-card">
          <h1>Invalid reset link</h1>
          <p className="simple-auth-text">
            This link is missing its reset code. Please request a new one.
          </p>
          <Link to="/forgot-password" className="simple-auth-link">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-auth-page">
      <div className="simple-auth-card">
        <form onSubmit={handleSubmit}>
          <h1>Choose a new password</h1>
          <p className="simple-auth-text">
            Use at least 8 characters.
          </p>

          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="confirm-new-password">Confirm new password</label>
          <input
            id="confirm-new-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label className="simple-auth-check">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show passwords
          </label>

          <button type="submit" className="simple-auth-btn" disabled={loading}>
            {loading ? "Saving..." : "Update password"}
          </button>

          <Link to="/LoginSignup" className="simple-auth-link">
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;