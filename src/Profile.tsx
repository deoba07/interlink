import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import "./Profile.css";
import SkeletonProfile from "./components/SkeletonProfile";

type ProfileData = {
  name: string;
  email: string;
  savedCount: number;
  appliedCount: number;
};

function Profile() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    savedCount: 0,
    appliedCount: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          "https://backlink-6l9m.onrender.com/internships/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="profile-layout">

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* CONTENT */}
      <main
        className="profile-content"
        style={{
          marginLeft: collapsed ? "80px" : "260px",
          transition: "0.3s ease",
        }}
      >
        {loading ? (
          <SkeletonProfile />
        ) : (
          <>
            <div className="profile-card">

              <div className="avatar">
                {initials}
              </div>

              <h2>Hello, {profile.name} 👋</h2>

              <p>{profile.email}</p>

            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <h3>⭐ Saved</h3>
                <span>{profile.savedCount}</span>
              </div>

              <div className="stat-card">
                <h3>✅ Applied</h3>
                <span>{profile.appliedCount}</span>
              </div>

            </div>

            <div className="activity-card">

              <h3>Recent Activity</h3>

              <div className="activity-item">
                ⭐ Your recent saved internships will appear here.
              </div>

              <div className="activity-item">
                ✅ Your recent applications will appear here.
              </div>

            </div>
          </>
        )}
      </main>

    </div>
  );
}

export default Profile;