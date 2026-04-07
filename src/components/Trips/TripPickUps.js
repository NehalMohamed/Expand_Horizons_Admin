import React, { useEffect, useState } from "react";
import TripHeader from "./TripHeader";
import { Form, Row, Col, Button, Table, Accordion } from "react-bootstrap";
import {
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaGlobe,
  FaMapPin,
  FaPlus,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import {
  GetPickupsAllForTrip,
  SaveMainTripPickups,
  SaveTripPickupsTranslations,
} from "../../slices/tripSlice";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import { FiMap, FiMapPin, FiRefreshCcw } from "react-icons/fi";
import PickupTranslationModal from "./PickupTranslationModal";

function TripPickUps() {
  const dispatch = useDispatch();
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [currentMainPickUp, setCurrentMainPickUp] = useState(null);
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [trip_id, setTrip_id] = useState(0);
  const [isUpdate, setIsUpdate] = useState(0);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    trip_id: Number(trip_id),
    trip_type: 1,
    order: 0,
    pickup_code: "",
    pickup_default_name: "",
    duration: "",
    delete: false,
  });
  const { loading, error, TripPickups } = useSelector((state) => state.trips);
  const handleTripChange = (trip) => {
    setTrip_id(Number(trip?.id));
    let data = { trip_id: Number(trip?.id), trip_type: 1 };
    dispatch(GetPickupsAllForTrip(data));
    resetForm();
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const resetForm = () => {
    setFormData({
      id: 0,
      trip_id: trip_id,
      trip_type: 1,
      order: 1,
      pickup_code: "",
      pickup_default_name: "",
      duration: "",
      delete: false,
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    formData["trip_id"] = Number(trip_id);
    dispatch(SaveMainTripPickups(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        setFormData({
          id: 0,
          trip_id: trip_id,
          trip_type: 1,
          order: 1,
          pickup_code: "",
          pickup_default_name: "",
          duration: "",
          delete: false,
        });
        setIsUpdate(false);
        let data = { trip_id: Number(trip_id), trip_type: 1 };
        dispatch(GetPickupsAllForTrip(data));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  const handleDeleteClick = (pickup) => {
    let data = {
      id: pickup.trip_pickup_id,
      trip_id: trip_id,
      trip_type: 1,
      order: pickup.order,
      pickup_code: pickup.pickup_code,
      pickup_default_name: pickup.pickup_default_name,
      duration: pickup.duration,
      delete: true,
    };
    dispatch(SaveMainTripPickups(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setIsUpdate(false);
        let data = { trip_id: Number(trip_id), trip_type: 1 };
        dispatch(GetPickupsAllForTrip(data));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  const handleEdit = (pickup) => {
    setIsUpdate(true);
    setFilterExpanded(true);
    setFormData({
      id: pickup.trip_pickup_id,
      trip_id: trip_id,
      trip_type: 1,
      order: pickup.order,
      pickup_code: pickup.pickup_code,
      pickup_default_name: pickup.pickup_default_name,
      duration: pickup.duration,
      delete: false,
    });
  };
  const handleDeleteTranslation = (trans) => {
    let data = {
      id: trans.id,
      trip_pickup_id: trans.trip_pickup_id,
      lang_code: trans.lang_code,
      pickup_name: trans.pickup_name,
      pickup_description: trans.pickup_description,
      delete: true,
    };
    dispatch(SaveTripPickupsTranslations(data)).then((result) => {
      if (result.payload && result.payload.success) {
        let data = { trip_id: Number(trip_id), trip_type: 1 };
        dispatch(GetPickupsAllForTrip(data));
        setShowPopup(false);
      } else {
        setShowPopup(true);
        setPopupType("error");
        setPopupMessage(result.payload.errors);
      }
    });
  };
  const handleEditTranslation = (trans) => {
    setCurrentTranslation({
      id: trans.id,
      trip_pickup_id: trans.trip_pickup_id,
      lang_code: trans.lang_code,
      pickup_name: trans.pickup_name,
      pickup_description: trans.pickup_description,
      delete: false,
    });
    setShowTranslationModal(true);
  };
  // Handle adding a translation
  const handleAddTranslation = (pickup) => {
    setCurrentMainPickUp(pickup);
    setCurrentTranslation({
      id: 0,
      trip_pickup_id: pickup.trip_pickup_id,
      lang_code: "en",
      pickup_name: "",
      pickup_description: "",
      delete: false,
    });
    setShowTranslationModal(true);
  };
  return (
    <section className="layout_section">
      <div className="d-flex justify-content-between align-items-center">
        <TripHeader title="Trip PickUps" handleTripChange={handleTripChange} />
        {trip_id > 0 && (
          <Button
            variant="light"
            onClick={() => setFilterExpanded(!filterExpanded)}
            className="filter-toggle-btn mb-4"
          >
            {filterExpanded ? <FaChevronUp /> : <FaChevronDown />}
            <span className="ms-2">Add</span>
          </Button>
        )}
      </div>

      <hr className="divider" />
      {trip_id > 0 ? (
        <>
          {filterExpanded && (
            <>
              <Form className="AddEdit_form form_crud" onSubmit={onSubmit}>
                <Row>
                  <Col md={4}>
                    {" "}
                    <Form.Group className="mb-3">
                      {/* <Form.Label>Default Name</Form.Label> */}
                      <Form.Control
                        type="text"
                        placeholder="code"
                        name="pickup_code"
                        value={formData.pickup_code}
                        onChange={handleInputChange}
                        required
                        className="formInput"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    {" "}
                    <Form.Group className="mb-3">
                      {/* <Form.Label>Code</Form.Label> */}
                      <Form.Control
                        type="text"
                        placeholder="default name"
                        name="pickup_default_name"
                        onChange={handleInputChange}
                        required
                        value={formData.pickup_default_name}
                        className="formInput"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} xs={12}>
                    <Form.Group className="mb-3" controlId="packageName">
                      <Form.Control
                        type="text"
                        placeholder="duration"
                        name="duration"
                        onChange={handleInputChange}
                        required
                        value={formData.duration}
                        className="formInput"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="number"
                        placeholder="order"
                        name="order"
                        onChange={handleInputChange}
                        className="formInput"
                        value={formData.order}
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
                        variant="primary"
                        type="submit"
                        className="w-100 mt-30 darkBlue-Btn FullWidthBtn"
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
            {TripPickups &&
              TripPickups?.map((row, index) => (
                <Accordion key={index}>
                  <Accordion.Item eventKey={index}>
                    <Accordion.Header className="custom_accord">
                      <div className="d-flex justify-content-between w-100 align-items-center">
                        <div>
                          <FiMapPin className="mapIcon" />
                          {row.duration == null ? (
                            <span>{row.pickup_default_name}</span>
                          ) : (
                            <span>
                              {row.pickup_default_name} - {row.duration}
                            </span>
                          )}
                        </div>
                        <div>
                          {" "}
                          <Button
                            className="btn btn-sm action_btn dark-purble-btn"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent accordion toggle
                              handleAddTranslation(row);
                            }}
                            title="Add Translation"
                          >
                            <FaGlobe />
                          </Button>
                          <Button
                            className="btn btn-sm action_btn yellow-btn"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent accordion toggle
                              handleEdit(row);
                            }}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            className="btn btn-sm action_btn red-btn"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent accordion toggle
                              handleDeleteClick(row);
                            }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {row && row.translations.length > 0 ? (
                        <Table responsive>
                          <thead>
                            <tr>
                              <th>Lang Code</th>
                              <th>Name</th>
                              <th>Description</th>
                              <th>actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {row.translations.map((trans, key) => (
                              <tr key={key}>
                                <td>{trans.lang_code}</td>
                                <td>{trans.pickup_name}</td>
                                <td>{trans.pickup_description}</td>
                                <td>
                                  {" "}
                                  <Button
                                    className="btn btn-sm action_btn yellow-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditTranslation(trans); // prevent accordion toggle
                                    }}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    className="btn btn-sm action_btn red-btn"
                                    onClick={(e) => {
                                      e.stopPropagation(); // prevent accordion toggle
                                      handleDeleteTranslation(trans);
                                    }}
                                  >
                                    <FaTrash />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="centerSection">
                          <p>No data</p>
                        </div>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
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
      {/* Translation Modal */}
      <PickupTranslationModal
        show={showTranslationModal}
        setShow={setShowTranslationModal}
        trip_id={trip_id}
        currentTranslation={currentTranslation}
        setCurrentTranslation={setCurrentTranslation}
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />
    </section>
  );
}

export default TripPickUps;
