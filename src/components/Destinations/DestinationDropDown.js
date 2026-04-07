import React, { useEffect, useState, useRef } from "react";
import {
  GetDestination_Mains,
  GetImgsByDestination,
  UpdateDestinationImage,
  saveDestinationImage,
} from "../../slices/destinationSlice";
import { Form, Spinner, Button } from "react-bootstrap";
import { FiMapPin, FiCopy } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
function DestinationDropDown({ handleChange }) {
  const dispatch = useDispatch();
  const { DestinationMain, loading } = useSelector(
    (state) => state.destinations
  );
  const wrapperRef = useRef(null);
  // const [selectedLocation, setSelectedLocation] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    dispatch(GetDestination_Mains(false));
    return () => {};
  }, [dispatch]);

  // Filter options when search changes
  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(DestinationMain);
    } else {
      setFiltered(
        DestinationMain.filter((opt) =>
          opt?.dest_default_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, DestinationMain]);
  // Handle selection
  const handleSelect = (item) => {
    setSelected(item);
    handleChange(item);
    setShow(false);
  };
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
      {/* <Form.Label className="formLabel">Trip</Form.Label> */}
      <Form.Control
        type="text"
        placeholder={
          selected != null
            ? selected.dest_default_name
            : "select destination..."
        }
        // value={search}
        value={selected != null ? selected.dest_default_name : search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShow(!show)}
      />
      {selected && (
        <Button
          className="btn copy_btn"
          onClick={() =>
            navigator.clipboard.writeText(selected.dest_default_name)
          }
          title="Copy destination name"
        >
          <FiCopy />
        </Button>
      )}
      {show && (
        <div className="results-dropdown">
          {loading && (
            <div className="dropdown-item text-center">
              <Spinner animation="border" size="sm" /> Loading...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="dropdown-item text-muted">No results</div>
          )}

          {!loading &&
            filtered.map((dest, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleSelect(dest)}
              >
                <FiMapPin />
                {dest.dest_code} - {dest.dest_default_name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default DestinationDropDown;
