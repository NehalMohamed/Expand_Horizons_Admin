import { Link } from "react-router-dom";
import "./errors.scss";
const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-box">
        <h1>403</h1>
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
        <Link to="/home" className="btn-back">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
