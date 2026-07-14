import React, { useEffect, useState, useRef } from "react";
import { GetTransfer_Categories } from "../../slices/tripSlice";
import { Form, Spinner } from "react-bootstrap";
import { FiMapPin } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

/**
 * TransferDropDown Component
 *
 * Searchable dropdown used for selecting a transfer category.
 *
 * Features:
 * - Loads transfer categories from the API.
 * - Supports live searching/filtering.
 * - Closes automatically when clicking outside.
 * - Returns the selected item to the parent component.
 */
function TransferDropDown({ handleChange }) {
  const dispatch = useDispatch();

  // Get transfer categories and loading state from Redux
  const { TransferCategories, loading } = useSelector((state) => state.trips);

  // Reference used to detect clicks outside the dropdown
  const wrapperRef = useRef(null);

  // Filtered list displayed in the dropdown
  const [filtered, setFiltered] = useState([]);

  // Search text entered by the user
  const [search, setSearch] = useState("");

  // Currently selected transfer category
  const [selected, setSelected] = useState(null);

  // Controls dropdown visibility
  const [show, setShow] = useState(false);

  /**
   * Load transfer categories once when
   * the component is mounted.
   */
  useEffect(() => {
    dispatch(GetTransfer_Categories());
  }, [dispatch]);

  /**
   * Filter categories whenever the search text
   * or category list changes.
   *
   * If search is empty, display all categories.
   */
  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(TransferCategories);
    } else {
      setFiltered(
        TransferCategories.filter((opt) =>
          opt?.category_name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, TransferCategories]);

  /**
   * Handles category selection.
   *
   * Updates the selected value,
   * notifies the parent component,
   * and closes the dropdown.
   */
  const handleSelect = (item) => {
    setSelected(item);
    handleChange(item);
    setShow(false);
  };

  /**
   * Close the dropdown when the user clicks
   * anywhere outside the component.
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-select" ref={wrapperRef}>
      {/* Search / Selection Input */}
      <Form.Control
        type="text"
        placeholder={
          selected ? selected.category_name : "Select transfer category..."
        }
        value={selected ? selected.category_name : search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShow(!show)}
      />

      {/* Dropdown Results */}
      {show && (
        <div className="results-dropdown">
          {/* Loading Indicator */}
          {loading && (
            <div className="dropdown-item text-center">
              <Spinner animation="border" size="sm" /> Loading...
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div className="dropdown-item text-muted">No results</div>
          )}

          {/* Matching Categories */}
          {!loading &&
            filtered.map((t, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleSelect(t)}
              >
                <FiMapPin />
                {t.category_code} - {t.category_name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default TransferDropDown;
