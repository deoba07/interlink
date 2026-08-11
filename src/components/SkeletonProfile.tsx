import "./SkeletonProfile.css";

function SkeletonProfile() {
  return (
    <div className="profile-skeleton">

      <div className="profile-card">

        <div className="profile-avatar"></div>

        <div className="profile-name"></div>

        <div className="profile-email"></div>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-title"></div>
          <div className="stat-number"></div>
        </div>

        <div className="stat-card">
          <div className="stat-title"></div>
          <div className="stat-number"></div>
        </div>

      </div>

      <div className="activity-card">

        <div className="activity-heading"></div>

        <div className="activity-line"></div>
        <div className="activity-line"></div>
        <div className="activity-line short"></div>

      </div>

    </div>
  );
}

export default SkeletonProfile;