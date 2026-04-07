import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaStar, FaRegStar } from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as IO5Icons from "react-icons/io5";
import {} from "react-icons/fa";
import "./Dashboard.scss";
import { allMenuItems } from "../SideMenu/menuItems";
const allIcons = { ...FaIcons, ...IO5Icons, ...FiIcons, ...Fa6Icons };
const Dashboard = ({ userRole = "admin" }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [Items, setItems] = useState([]);
  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("dashboardFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      const user = JSON.parse(userLocal);
      if (user) {
        const authorizedMenuItems = allMenuItems.filter((item) =>
          item.roles.includes(user.role)
        );
        setItems(authorizedMenuItems || []);
        // setItems(menuItems[user.role] || []);
      }
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("dashboardFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Base menu items with access control
  // const allMenuItems = [
  //   {
  //     id: "users",
  //     title: "Users",
  //     icon: <FiUsers size={24} />,
  //     path: "/users",
  //     roles: ["admin", "manager"],
  //   },
  //   {
  //     id: "questions",
  //     title: "Questions",
  //     icon: <FiHelpCircle size={24} />,
  //     path: "/questions",
  //     roles: ["admin", "manager", "editor"],
  //   },
  //   {
  //     id: "features",
  //     title: "Features",
  //     icon: <FiLayers size={24} />,
  //     path: "/features",
  //     roles: ["admin", "manager", "sales"],
  //   },
  //   {
  //     id: "services",
  //     title: "Services",
  //     icon: <FiSettings size={24} />,
  //     path: "/services",
  //     roles: ["admin", "manager"],
  //   },
  //   {
  //     id: "packages",
  //     title: "Packages",
  //     icon: <IoLogoFirebase size={24} />,
  //     path: "/packages",
  //     roles: ["admin"],
  //   },
  //   {
  //     id: "pricing",
  //     title: "Pricing",
  //     icon: <FiDollarSign size={24} />,
  //     path: "/pricing",
  //     roles: ["admin", "manager", "analyst"],
  //   },
  //   {
  //     id: "invoices",
  //     title: "Invoices",
  //     icon: <FaFileInvoice size={24} />,
  //     path: "/invoices",
  //     roles: ["admin", "manager", "support"],
  //   },
  // ];

  // Filter menu items based on user role
  // const authorizedMenuItems = allMenuItems.filter((item) =>
  //   item.roles.includes(userRole)
  // );

  // Toggle favorite status
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Filter menu items based on search term and favorites toggle
  const filteredMenuItems = Items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isFavorite = favorites.includes(item.id);

    if (showFavoritesOnly) {
      return matchesSearch && isFavorite;
    }
    return matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, {userRole}</p> */}

        <div className="dashboard-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button
            className={`favorites-toggle ${showFavoritesOnly ? "active" : ""}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            {showFavoritesOnly ? "Show All" : "Show Favorites Only"}
          </button>
        </div>
      </header>

      {filteredMenuItems.length === 0 ? (
        <div className="no-results">
          {showFavoritesOnly
            ? "You don't have any favorites yet. Click the star icon to add some!"
            : "No menu items match your search."}
        </div>
      ) : (
        <div className="dashboard-grid">
          {filteredMenuItems.map((item) => {
            const IconComponent = allIcons[item.icon];
            return (
              <div
                key={item.id}
                className="dashboard-card"
                onClick={() => navigate(item.path)}
              >
                <div className="card-header">
                  <div className="dashboard-card-icon">
                    {/* {item.icon} */}
                    {IconComponent && (
                      <IconComponent className="menu-icon" size={24} />
                    )}
                  </div>
                  <button
                    className="favorite-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    {favorites.includes(item.id) ? (
                      <FaStar className="favorite-icon" />
                    ) : (
                      <FaRegStar className="favorite-icon" />
                    )}
                  </button>
                </div>
                <h3 className="dashboard-card-title">{item.title}</h3>
                {favorites.includes(item.id) && (
                  <div className="favorite-badge">Favorite</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
