import "./SkeletonCard.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card">

      <div className="skeleton-header">
        <div className="skeleton-logo"></div>

        <div className="skeleton-company">
          <div className="skeleton-line company-name"></div>
          <div className="skeleton-line company-location"></div>
        </div>
      </div>

      <div className="skeleton-line title"></div>

      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>

      <div className="skeleton-footer">
        <div className="skeleton-button"></div>
      </div>

    </div>
  );
}

export default SkeletonCard;