import "./SkeletonDetails.css";

function SkeletonDetails() {
  return (
    <div className="details-skeleton">

      {/* Header */}
      <div className="details-header">

        <div className="skeleton-company-logo"></div>

        <div className="header-info">
          <div className="skeleton-line title"></div>
          <div className="skeleton-line company"></div>
          <div className="skeleton-line location"></div>
        </div>

      </div>

      {/* Buttons */}
      <div className="action-buttons">
        <div className="skeleton-btn"></div>
        <div className="skeleton-btn"></div>
      </div>

      {/* About */}
      <div className="details-card">
        <div className="skeleton-heading"></div>

        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>

      {/* Responsibilities */}
      <div className="details-card">
        <div className="skeleton-heading"></div>

        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>

      {/* Requirements */}
      <div className="details-card">
        <div className="skeleton-heading"></div>

        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>

      {/* Company */}
      <div className="details-card">
        <div className="skeleton-heading"></div>

        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>

    </div>
  );
}

export default SkeletonDetails;