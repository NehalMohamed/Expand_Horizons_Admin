import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import "./SideMenu.scss";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TripsSubMenu from "./TripsSubMenu";
import DestinationSubMenu from "./DestinationSubMenu";
import { allMenuItems, SubMenuItems } from "./menuItems";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as IO5Icons from "react-icons/io5";
import * as Fa6Icons from "react-icons/fa6";
const allIcons = { ...FaIcons, ...IO5Icons, ...FiIcons, ...Fa6Icons };
export default function SideMenu({ ChangeLayoutWidth }) {
  const navigate = useNavigate();
  const [Items, setItems] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [destOpenMenu, setDestOpenMenu] = useState(null);
  const [MyName, setMyName] = useState("");
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  const toggleSubmenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const toggleDestSubmenu = (menu) => {
    setDestOpenMenu(destOpenMenu === menu ? null : menu);
  };
  // useEffect(() => {
  //   const userLocal = localStorage.getItem("user");
  //   if (userLocal) {
  //     const user = JSON.parse(userLocal);
  //     if (user) {
  //       setMyName(`${user.firstName} ${user.lastName}`);
  //     }
  //   }
  // }, []);
  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      const user = JSON.parse(userLocal);
      if (user) {
        setMyName(`${user.firstName} ${user.lastName}`);

        // Filter menu items based on user role
        const authorizedMenuItems = allMenuItems.filter((item) =>
          item.roles.includes(user.role)
        );

        setItems(authorizedMenuItems || []);
        // setItems(menuItems[user.role] || []);
      }
    }
  }, []);
  return (
    <div className={`side-menu ${collapsed ? "collapsed" : ""}`}>
      {/* {!collapsed && <h3>Menu</h3>} */}
      {/* Top Bar with Logo and Toggle */}
      <div className="side-menu-topbar">
        {!collapsed && (
          <img src="/images/logo.png" alt="Logo" className="logo" />
        )}
        <button
          className="toggle-button"
          onClick={() => {
            setCollapsed((prev) => !prev);
            ChangeLayoutWidth((prev) => !prev);
          }}
        >
          {!collapsed ? (
            <FiChevronLeft size={20} />
          ) : (
            <FiChevronRight size={20} />
          )}
        </button>
      </div>
      <ul>
        {Items &&
          Items.map((item, index) => {
            const IconComponent = allIcons[item.icon];
            return item.withSub == false ? (
              <li key={index}>
                <Link to={item.path}>
                  {IconComponent && <IconComponent className="menu-icon" />}{" "}
                  <span className="menu-label">{item.title}</span>
                </Link>
              </li>
            ) : (
              <li key={index}>
                <div
                  className={
                    item.id == "trips"
                      ? `menu-item ${openMenu === item.id ? "open" : ""}`
                      : `menu-item ${destOpenMenu === item.id ? "open" : ""}`
                  }
                >
                  <Link to={item.path} className="left">
                    {IconComponent && <IconComponent className="menu-icon" />}
                    <span className="menu-label">{item.title}</span>
                  </Link>
                  {!collapsed && (
                    <span
                      className="arrow"
                      onClick={() => toggleSubmenu(item.id)}
                    >
                      <FaChevronDown className="arrow" />
                    </span>
                  )}
                </div>
                <ul className={`submenu ${openMenu === item.id ? "open" : ""}`}>
                  {SubMenuItems &&
                    SubMenuItems.filter((sub) => sub.parentId == item.id).map(
                      (sub, key) => {
                        const SubIconComponent = allIcons[sub.icon];
                        return (
                          <li key={key}>
                            <Link to={sub.path}>
                              {SubIconComponent && (
                                <SubIconComponent className="menu-icon" />
                              )}
                              <span className="menu-label">{sub.title}</span>
                            </Link>
                          </li>
                        );
                      }
                    )}
                </ul>
                {/* <TripsSubMenu openMenu={openMenu} /> */}
              </li>
            );
          })}
        {/* <li>
          <Link to="/dashboard">
            <FaChartSimple /> <span className="menu-label">Dashboard</span>
          </Link>
        </li>
        <li>
          <div
            className={`menu-item ${
              destOpenMenu === "destinations" ? "open" : ""
            }`}
          >
            <Link to="/destinations" className="left">
              <FaCity />
              <span className="menu-label">Destinations</span>
            </Link>
            {!collapsed && (
              <span
                className="arrow"
                onClick={() => toggleDestSubmenu("destinations")}
              >
                <FaChevronDown className="arrow" />
              </span>
            )}
          </div>
          <DestinationSubMenu openMenu={destOpenMenu} />
        </li>

        <li>
          <div className={`menu-item ${openMenu === "trips" ? "open" : ""}`}>
            <Link to="/trips" className="left">
              <FaShip />
              <span className="menu-label">Trips</span>
            </Link>
            {!collapsed && (
              <span className="arrow" onClick={() => toggleSubmenu("trips")}>
                <FaChevronDown className="arrow" />
              </span>
            )}
          </div>
          <TripsSubMenu openMenu={openMenu} />
        </li>
        <li>
          <Link to="/facility">
            <FaInfo /> <span className="menu-label">Facilities Setting</span>
          </Link>
        </li> */}
      </ul>
      {/* Bottom Section */}
      <div className="side-menu-footer">
        <div className="footer-content">
          <div className="user-info">
            <FiUser className="user-icon" />
            {!collapsed && <span className="user-title">{MyName}</span>}
          </div>

          <div className="menu-actions">
            <button className="menu-action-button">
              <FiSearch className="action-icon" />
              {!collapsed && <span>Search</span>}
            </button>

            {MyName && (
              <button className="menu-action-button" onClick={logOut}>
                <FiLogOut className="action-icon" />
                {!collapsed && <span>Logout</span>}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* <button
        className="collapse-btn"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? "➡️" : "⬅️"}
      </button> */}
    </div>
  );
}
