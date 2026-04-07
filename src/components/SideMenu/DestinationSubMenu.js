import React from "react";
import { FaFileImage } from "react-icons/fa";
import { Link } from "react-router-dom";
function DestinationSubMenu({ openMenu }) {
  return (
    <ul className={`submenu ${openMenu === "destinations" ? "open" : ""}`}>
      <li>
        <Link to="/destinations/images">
          <FaFileImage />
          <span className="menu-label">Images</span>
        </Link>
      </li>
    </ul>
  );
}

export default DestinationSubMenu;
