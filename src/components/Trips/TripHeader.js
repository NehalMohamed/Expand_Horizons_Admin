import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

import TripsDropDown from "./TripsDropDown";
function TripHeader({ title, handleTripChange, isPriceTab }) {
  const [trip_id, setTrip_id] = useState(0);

  // useEffect(() => {
  //   let data = { destination_id: 0, trip_type: 0 };
  //   dispatch(GetTrip_Mains(data));
  //   return () => {};
  // }, [dispatch]);
  const handleChange = (trip) => {
    // const id = e.target.value;
    setTrip_id(trip?.id);
    handleTripChange(trip);
  };
  return (
    <div className="header_title">
      <h2 className="mb-4 page-title">{title}</h2>
      <TripsDropDown handleChange={handleChange} />
      {/* <div className="position-relative">
        <Form.Group>
          <Form.Control
            as="select"
            name="trip_id"
            onChange={handleChange}
            value={trip_id}
            required
            className="formInput"
          >
            <option value="">select trip</option>

            {TripsMain &&
              TripsMain.map((trip, index) => (
                <option key={index} value={trip.id}>
                  {trip.trip_code} - {trip.trip_default_name}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
      </div> */}
    </div>
  );
}

export default TripHeader;

{
  /* {TripsMain &&
              TripsMain?.filter(
                (f) => f.trip_type != (isPriceTab == true ? 2 : -1)
              ).map((trip, index) => (
                <option key={index} value={trip.id}>
                  {trip.trip_code} - {trip.trip_default_name}
                </option>
              ))} */
}
