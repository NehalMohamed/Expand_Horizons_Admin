import React, { useEffect, useState, useRef } from "react";
import { Form, Spinner, Button } from "react-bootstrap";
import { FaShip } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { GetTrip_Mains } from "../../slices/tripSlice";
import { FiCopy } from "react-icons/fi";
function TripsDropDown({ handleChange }) {
  const dispatch = useDispatch();
  const { TripsMain, loading, error } = useSelector((state) => state.trips);
  const wrapperRef = useRef(null);
  // const [selectedLocation, setSelectedLocation] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let data = { destination_id: 0, trip_type: 0 };
    dispatch(GetTrip_Mains(data));
    return () => {};
  }, [dispatch]);

  // Filter options when search changes
  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(TripsMain);
    } else {
      setFiltered(
        TripsMain.filter((opt) =>
          opt?.trip_default_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, TripsMain]);
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
          selected != null ? selected.trip_default_name : "select trip..."
        }
        value={
          selected != null
            ? selected.trip_default_name
            : search != null
            ? search
            : ""
        }
        onChange={(e) => {
          setSearch(e.target.value);
          setSelected(e.target.value);
        }}
        onFocus={() => setShow(!show)}
      />
      {selected && (
        <Button
          className="btn copy_btn"
          onClick={() =>
            navigator.clipboard.writeText(selected.trip_default_name)
          }
          title="Copy trip name"
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
            filtered.map((trip, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleSelect(trip)}
              >
                <FaShip />
                {trip.trip_code} - {trip.trip_default_name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default TripsDropDown;
