/**
 * TripPrices Component
 *
 * Purpose:
 * - Manages all pricing records assigned to a selected trip.
 * - Allows administrators to create, update, and delete trip prices.
 * - Supports different pricing types (Per Pax / Per Unit).
 * - Manages pricing details such as:
 *    • Original Price
 *    • Sale Price
 *    • Child Price
 *    • Currency
 *    • Pax Range
 *    • Notes
 * - Opens the Child Policy modal for configuring child pricing rules.
 *
 * Workflow:
 * 1. Select a trip using the TripHeader component.
 * 2. Load all existing prices for the selected trip.
 * 3. Expand the Add/Edit panel.
 * 4. Create or update a pricing record.
 * 5. Display all prices in a table with edit/delete actions.
 *
 * Dependencies:
 * - Redux (tripSlice)
 * - TripHeader
 * - ChildPolicy
 * - CurrencySelect
 * - LoadingPage
 * - PopUp
 */
import React, { useEffect, useState } from "react";
import TripHeader from "./TripHeader";
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaUpload,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { GetTrip_Prices, SaveTripPrices } from "../../slices/tripSlice";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import { FiRefreshCcw } from "react-icons/fi";
import ChildPolicy from "./ChildPolicy";
import CurrencySelect from "../Shared/MainSetting/CurrencySelect";
const priceTypes = [
  { id: 1, name: "Per Pax" },
  { id: 2, name: "Per Unit" },
];
function TripPrices() {
  const dispatch = useDispatch();
  const { companyCurrencyCode } = useSelector((state) => state.exchange);
  // Controls visibility of the Add/Edit pricing panel
  const [Expanded, setExpanded] = useState(false);

  // Popup notification state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");

  // Currently selected trip
  const [trip_id, setTrip_id] = useState(0);

  // Indicates whether the form is editing an existing record
  const [isUpdate, setIsUpdate] = useState(0);

  // Controls Child Policy modal visibility
  const [showChildPolicy, setShowChildPolicy] = useState(false);

  // Form model used for creating/updating trip prices
  const [formData, setFormData] = useState({
    id: 0,
    trip_id: trip_id,
    trip_origin_price: 0,
    trip_sale_price: 0,
    currency_code: companyCurrencyCode || "EUR",
    delete: false,
    child_price: 0,
    notes: "",
    pax_from: 0,
    pax_to: 0,
    pricing_type: 1,
  });
  // Called whenever a trip is selected from TripHeader.
  // Loads all pricing records for the selected trip
  // and resets the editor form.
  const handleTripChange = (trip) => {
    setTrip_id(trip?.id);
    dispatch(GetTrip_Prices(trip?.id));
    resetForm();
  };

  // Retrieve pricing data and loading state from Redux
  const { loading, error, TripPriceList } = useSelector((state) => state.trips);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Deletes an existing pricing record.
  // The API uses a soft-delete flag instead of a dedicated delete endpoint.
  const handleDeleteClick = (price) => {
    let data = {
      id: price.id,
      trip_id: trip_id,
      trip_origin_price: price.trip_origin_price,
      trip_sale_price: price.trip_sale_price,
      currency_code: price.currency_code,
      delete: true,
      child_price: price.child_price,
      notes: price.notes,
      pax_from: price.pax_from,
      pax_to: price.pax_to,
      pricing_type: price.pricing_type,
    };
    dispatch(SaveTripPrices(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        // Refresh pricing list after successful deletion
        dispatch(GetTrip_Prices(trip_id));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  // Creates a new price or updates an existing one.
  // The same API endpoint handles both operations based on the record id.
  const handleAdd = (e) => {
    e.preventDefault();
    formData["trip_id"] = trip_id;
    formData["currency_code"] = companyCurrencyCode || "EUR";
    dispatch(SaveTripPrices(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        dispatch(GetTrip_Prices(trip_id));
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
      setIsUpdate(false);
      setFormData({
        id: 0,
        trip_id: 0,
        trip_origin_price: 0,
        trip_sale_price: 0,
        currency_code: companyCurrencyCode || "EUR",
        delete: false,
        child_price: 0,
        notes: "",
        pax_from: 0,
        pax_to: 0,
        pricing_type: 1,
      });
    });
  };
  // Clears the editor and switches back to Add mode.
  const resetForm = () => {
    setIsUpdate(false);
    setFormData({
      id: 0,
      trip_id: 0,
      trip_origin_price: 0,
      trip_sale_price: 0,
      currency_code: companyCurrencyCode || "EUR",
      delete: false,
      child_price: 0,
      notes: "",
      pax_from: 0,
      pax_to: 0,
      pricing_type: 1,
    });
  };
  // Loads the selected pricing record into the form
  // and expands the editor for updating.
  const handleEdit = (trip) => {
    setIsUpdate(true);
    setExpanded(true);
    setFormData({
      id: trip.id,
      trip_id: trip_id,
      trip_origin_price: trip.trip_origin_price,
      trip_sale_price: trip.trip_sale_price,
      currency_code: trip.currency_code,
      delete: false,
      child_price: trip.child_price,
      notes: trip.notes,
      pax_from: trip.pax_from,
      pax_to: trip.pax_to,
      pricing_type: trip.pricing_type,
    });
  };
  //console.log("companyCurrencyCode ", companyCurrencyCode);
  return (
    <section className="layout_section">
      <div className="d-flex justify-content-between align-items-center">
        <TripHeader
          title="Trip Prices"
          handleTripChange={handleTripChange}
          isPriceTab={true}
        />
        {trip_id > 0 && (
          <Button
            variant="light"
            onClick={() => setExpanded(!Expanded)}
            className="filter-toggle-btn mb-4"
          >
            {Expanded ? <FaChevronUp /> : <FaChevronDown />}
            <span className="ms-2">Add</span>
          </Button>
        )}
      </div>

      <hr className="divider" />
      {trip_id > 0 ? (
        <>
          {Expanded && (
            <>
              <Form onSubmit={handleAdd} className="form_crud">
                <Row>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        className="form-control"
                        placeholder="Enter price"
                        value={formData.trip_origin_price}
                        name="trip_origin_price"
                        onChange={handleInputChange}
                        required
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Sale Price</Form.Label>
                      <Form.Control
                        type="number"
                        className="form-control"
                        placeholder="Enter sale price"
                        value={formData.trip_sale_price}
                        name="trip_sale_price"
                        onChange={handleInputChange}
                        required
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Child Price</Form.Label>
                      <Form.Control
                        type="number"
                        className="form-control"
                        placeholder="Enter price"
                        value={formData.child_price}
                        name="child_price"
                        onChange={handleInputChange}
                        required
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Pricing Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="pricing_type"
                        value={formData.pricing_type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value={""}>select</option>
                        {priceTypes.map((type, index) => (
                          <option key={index} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={2}>
                    <Form.Group controlId="curr_code">
                      <Form.Label>Currency</Form.Label>
                      <Form.Control
                        type="text"
                        value={companyCurrencyCode || formData.currency_code}
                        readOnly
                      />
                      {/* <Form.Control
                        as="select"
                        name="currency_code"
                        value={formData.currency_code}
                        onChange={handleInputChange}
                        required
                      >
                        <option value={""}>select Currency</option>
                        <CurrencySelect /> */}
                      {/* </Form.Control> */}
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Pax from</Form.Label>
                      <Form.Control
                        type="number"
                        className="form-control"
                        placeholder="pax from"
                        value={formData.pax_from}
                        name="pax_from"
                        onChange={handleInputChange}
                        required
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Pax To</Form.Label>
                      <Form.Control
                        type="number"
                        className="form-control"
                        placeholder="pax to"
                        value={formData.pax_to}
                        name="pax_to"
                        onChange={handleInputChange}
                        required
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="formInput"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  {isUpdate ? (
                    <>
                      <Col xs={12} md={{ span: 2, offset: 8 }}>
                        {" "}
                        <Button
                          className="darkBlue-Btn FullWidthBtn"
                          type="submit"
                        >
                          <FaUpload className="me-1" /> update
                        </Button>
                      </Col>
                      <Col xs={12} md={2}>
                        <Button
                          className="purble-btn FullWidthBtn"
                          onClick={resetForm}
                        >
                          <FiRefreshCcw className="me-1" /> Reset
                        </Button>
                      </Col>
                    </>
                  ) : (
                    <Col xs={12} md={{ span: 4, offset: 8 }}>
                      <Button
                        className="darkBlue-Btn FullWidthBtn"
                        type="submit"
                      >
                        <FaPlus className="me-1" /> Add
                      </Button>
                    </Col>
                  )}
                </Row>
              </Form>
              <hr className="divider" />
            </>
          )}

          <div className="result_list">
            {" "}
            <Button
              className="secondryBtn mb-4"
              onClick={() => setShowChildPolicy(true)}
            >
              Child Policy
            </Button>
            {TripPriceList && TripPriceList.length > 0 && (
              <Table responsive>
                <thead>
                  <tr className="main_row">
                    <th>Origin Price</th>
                    <th>Sale Price</th>
                    <th>Currency</th>
                    <th>Child price</th>
                    <th>Pax From</th>
                    <th>Pax To</th>
                    <th>pricing type</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {TripPriceList.map((price, index) => (
                    <tr key={index}>
                      <td>{price.trip_origin_price}</td>
                      <td>{price.trip_sale_price}</td>
                      <td>{price.currency_code}</td>
                      <td>{price.child_price}</td>
                      <td>{price.pax_from}</td>
                      <td>{price.pax_to}</td>
                      <td>
                        {price.pricing_type == 1 ? "Per Pax" : "Per Unit"}
                      </td>
                      <td>{price.notes}</td>
                      <td>
                        <div className="d-flex btn-lst">
                          <button
                            className="btn btn-sm action_btn yellow-btn"
                            onClick={() => handleEdit(price)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger action_btn"
                            onClick={() => handleDeleteClick(price)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </>
      ) : (
        <div className="centerSection">
          <p>No data</p>
        </div>
      )}

      {loading ? <LoadingPage /> : null}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
      <ChildPolicy
        show={showChildPolicy}
        setShow={setShowChildPolicy}
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
        trip_id={trip_id}
      />
    </section>
  );
}

export default TripPrices;
