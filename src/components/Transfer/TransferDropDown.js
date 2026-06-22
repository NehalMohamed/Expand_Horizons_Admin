import React, { useEffect, useState, useRef } from "react";
import { GetTransfer_Categories } from "../../slices/tripSlice";
import { Form, Spinner, Button } from "react-bootstrap";
import { FiMapPin } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";

function TransferDropDown({ handleChange }) {
  const dispatch = useDispatch();
  const { TransferCategories, loading } = useSelector((state) => state.trips);
  const wrapperRef = useRef(null);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    dispatch(GetTransfer_Categories());
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    if (search.trim() === "") setFiltered(TransferCategories);
    else
      setFiltered(
        TransferCategories.filter((opt) =>
          opt?.category_name.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [search, TransferCategories]);

  const handleSelect = (item) => {
    setSelected(item);
    handleChange(item);
    setShow(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShow(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-select" ref={wrapperRef}>
      <Form.Control
        type="text"
        placeholder={selected != null ? selected.category_name : "select transfer category..."}
        value={selected != null ? selected.category_name : search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShow(!show)}
      />
      {show && (
        <div className="results-dropdown">
          {loading && (
            <div className="dropdown-item text-center">
              <Spinner animation="border" size="sm" /> Loading...
            </div>
          )}
          {!loading && filtered.length === 0 && <div className="dropdown-item text-muted">No results</div>}
          {!loading &&
            filtered.map((t, index) => (
              <div key={index} className="dropdown-item" onClick={() => handleSelect(t)}>
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
