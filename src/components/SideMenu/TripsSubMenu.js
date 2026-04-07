import React from "react";
import {
  FaDollarSign,
  FaFileImage,
  FaGlobe,
  FaInfo,
  FaMapMarked,
} from "react-icons/fa";
import { Link } from "react-router-dom";
function TripsSubMenu({ openMenu }) {
  return (
    <ul className={`submenu ${openMenu === "trips" ? "open" : ""}`}>
      <li>
        <Link to="/trips/translation">
          <FaGlobe />
          <span className="menu-label">Translations</span>
        </Link>
      </li>
      <li>
        <Link to="/trips/prices">
          <FaDollarSign /> <span className="menu-label">Prices</span>
        </Link>
      </li>
      <li>
        <Link to="/trips/pickups">
          <FaMapMarked />
          <span className="menu-label">Pick ups</span>
        </Link>
      </li>
      <li>
        <Link to="/trips/images">
          <FaFileImage />
          <span className="menu-label">Images</span>
        </Link>
      </li>
      <li>
        <Link to="/trips/facility">
          <FaInfo />
          <span className="menu-label">Facility</span>
        </Link>
      </li>
    </ul>
  );
}

export default TripsSubMenu;
