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
function TripFacility() {
  const dispatch = useDispatch();
  const { TripFacility, loading, error } = useSelector(
    (state) => state.facility
  );
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [trip_id, setTrip_id] = useState(0);
  const [formData, setFormData] = useState({
    id: 0,
    trip_id: trip_id,
    facility_id: 0,
    selected: false,
  });
  const handleTripChange = (trip) => {
    setTrip_id(trip?.id);
    dispatch(GetFacilityAllWithSelect(trip?.id));
  };
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
        setShowPopup(false);
        dispatch(GetFacilityAllWithSelect(trip_id));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  return (
    <section className="layout_section">
      <TripHeader title="Trip Facility" handleTripChange={handleTripChange} />
      <hr className="divider" />
      {trip_id > 0 ? (
        <div className="result_list">
          <Form>
            <Row>
              {" "}
              {TripFacility && TripFacility.length > 0 ? (
                TripFacility.map((fac, index) => (
                  <Col md={6} xs={12} key={index}>
                    <Form.Check
                      type={"checkbox"}
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
        <div className="centerSection">
          <p>No data</p>
        </div>
      )}
    </section>
  );
}

export default TripFacility;
