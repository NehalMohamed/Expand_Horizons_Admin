import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { FaSearch, FaStar, FaRegStar } from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as IO5Icons from "react-icons/io5";

import "./Dashboard.scss";
import { allMenuItems } from "../SideMenu/menuItems";

// Merge all supported icon libraries into a single object.
// This allows icons to be rendered dynamically using their name.
const allIcons = {
  ...FaIcons,
  ...IO5Icons,
  ...FiIcons,
  ...Fa6Icons,
};

/**
 * Dashboard Component
 *
 * Displays all menu items that the current user
 * is authorized to access.
 *
 * Features:
 * - Search menu items
 * - Mark menu items as favorites
 * - Show only favorite items
 * - Persist favorites using localStorage
 * - Navigate to selected page
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Search keyword entered by the user
  const [searchTerm, setSearchTerm] = useState("");

  // List of favorite menu item ids
  const [favorites, setFavorites] = useState([]);

  // Determines whether only favorite items should be displayed
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Authorized menu items for the current user
  const [items, setItems] = useState([]);

  /**
   * Component Initialization
   *
   * - Load favorite items from localStorage.
   * - Load current user information.
   * - Filter menu items based on the user's role.
   */
  useEffect(() => {
    // Restore favorite items
    const savedFavorites = localStorage.getItem("dashboardFavorites");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Load logged-in user
    const userLocal = localStorage.getItem("user");

    if (userLocal) {
      const user = JSON.parse(userLocal);

      if (user) {
        // Keep only menu items that the user is allowed to access
        const authorizedMenuItems = allMenuItems.filter((item) =>
          item.roles.includes(user.role),
        );

        setItems(authorizedMenuItems || []);
      }
    }
  }, []);

  /**
   * Save favorite menu items whenever
   * the favorites list changes.
   */
  useEffect(() => {
    localStorage.setItem("dashboardFavorites", JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Adds or removes a menu item
   * from the favorites list.
   *
   * @param {number|string} id Menu item id
   */
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  /**
   * Filter menu items using:
   * - Search text
   * - Favorites mode
   */
  const filteredMenuItems = items.filter((item) => {
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
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="dashboard-controls">
          {/* Search Box */}
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

          {/* Toggle between all items and favorites only */}
          <button
            className={`favorites-toggle ${showFavoritesOnly ? "active" : ""}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            {showFavoritesOnly ? "Show All" : "Show Favorites Only"}
          </button>
        </div>
      </header>

      {/* Empty State */}
      {filteredMenuItems.length === 0 ? (
        <div className="no-results">
          {showFavoritesOnly
            ? "You don't have any favorites yet. Click the star icon to add some!"
            : "No menu items match your search."}
        </div>
      ) : (
        /* Dashboard Cards */
        <div className="dashboard-grid">
          {filteredMenuItems.map((item) => {
            // Get icon component dynamically from its name
            const IconComponent = allIcons[item.icon];

            return (
              <div
                key={item.id}
                className="dashboard-card"
                // Navigate to selected page
                onClick={() => navigate(item.path)}
              >
                {/* Card Header */}
                <div className="card-header">
                  {/* Menu Icon */}
                  <div className="dashboard-card-icon">
                    {IconComponent && (
                      <IconComponent className="menu-icon" size={24} />
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    className="favorite-button"
                    onClick={(e) => {
                      // Prevent card click navigation
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

                {/* Menu Title */}
                <h3 className="dashboard-card-title">{item.title}</h3>

                {/* Favorite Badge */}
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
