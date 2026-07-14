import React, { useEffect, useState } from "react";
import TripHeader from "./TripHeader";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import {
  GetFacilityAllWithSelect,
  AssignFacilityToTrip,
} from "../../slices/facilitySlice";

/**
 * TripFacility Component
 *
 * Purpose:
 * Allows administrators to assign or remove facilities from a selected trip.
 *
 * Features:
 * - Select a trip using the shared TripHeader component.
 * - Load all available facilities with their current assignment status.
 * - Toggle facility assignment using checkboxes.
 * - Automatically save changes to the backend.
 * - Display success/error popup messages.
 *
 * Redux Actions:
 * - GetFacilityAllWithSelect(): Retrieves all facilities with selection status.
 * - AssignFacilityToTrip(): Assigns or removes a facility from the selected trip.
 */
function TripFacility() {
  const dispatch = useDispatch();

  // Get facilities and loading state from Redux
  const { TripFacility, loading, error } = useSelector(
    (state) => state.facility,
  );

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");

  // Currently selected trip id
  const [trip_id, setTrip_id] = useState(0);

  // Assignment model (reserved for future use)
  const [formData, setFormData] = useState({
    id: 0,
    trip_id: trip_id,
    facility_id: 0,
    selected: false,
  });

  /**
   * Triggered when a trip is selected.
   * Stores the trip id and loads all facilities for that trip.
   */
  const handleTripChange = (trip) => {
    setTrip_id(trip?.id);
    dispatch(GetFacilityAllWithSelect(trip?.id));
  };

  /**
   * Handles assigning/removing a facility from the selected trip.
   * Updates the backend then reloads the facility list.
   */
  const handleFacilityChange = (e, facility) => {
    console.log(e.target.checked);

    let checked = e.target.checked;

    let data = {
      id: facility.fac_trip_id,
      trip_id: Number(trip_id),
      facility_id: facility.facility_id,
      selected: checked,
      active: true,
    };

    dispatch(AssignFacilityToTrip(data)).then((result) => {
      if (result.payload && result.payload.success) {
        // Refresh facilities after successful update
        setShowPopup(false);
        dispatch(GetFacilityAllWithSelect(trip_id));
      } else {
        // Display validation/server errors
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };

  return (
    <section className="layout_section">
      {/* Shared trip selector */}
      <TripHeader title="Trip Facility" handleTripChange={handleTripChange} />

      <hr className="divider" />

      {/* Show facilities only after selecting a trip */}
      {trip_id > 0 ? (
        <div className="result_list">
          <Form>
            <Row>
              {TripFacility && TripFacility.length > 0 ? (
                TripFacility.map((fac, index) => (
                  <Col md={6} xs={12} key={index}>
                    <Form.Check
                      type="checkbox"
                      id={`check-${index}`}
                      label={fac.facility_default_name}
                      className="fac_check"
                      checked={fac.selected}
                      onChange={(e) => handleFacilityChange(e, fac)}
                    />
                  </Col>
                ))
              ) : (
                <div className="centerSection">
                  <p>No data</p>
                </div>
              )}
            </Row>
          </Form>
        </div>
      ) : (
        // Display placeholder until a trip is selected
        <div className="centerSection">
          <p>No data</p>
        </div>
      )}

      {/* Optional loading indicator (if needed) */}
      {/* {loading && <LoadingPage />} */}

      {/* Optional popup (currently state is prepared for future usage) */}
      {/* 
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
      */}
    </section>
  );
}

export default TripFacility;
