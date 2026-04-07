import React from "react";
import { Modal, Spinner, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  SaveTripPickupsTranslations,
  GetPickupsAllForTrip,
} from "../../slices/tripSlice";
import LangSelect from "../Shared/MainSetting/LangSelect";

const PickupTranslationModal = ({
  show,
  setShow,
  trip_id,
  currentTranslation,
  setCurrentTranslation,
  setPopupMessage,
  setPopupType,
  setShowPopup,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.trips); // Get translation status from Redux store

  // Handle translation submission
  const handleTranslationSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SaveTripPickupsTranslations(currentTranslation)).then(
        (result) => {
          if (result.payload && result.payload.success) {
            let data = { trip_id: Number(trip_id), trip_type: 1 };
            dispatch(GetPickupsAllForTrip(data));
            setShow(false);
          } else {
            setShowPopup(true);
            setPopupType("error");
            setPopupMessage(result.payload.errors);
          }
        }
      );
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Failed to save  translation";
      setPopupMessage(errorMessage);
      setPopupType("error");
      setShowPopup(true);
    }
  };

  // Handle translation input changes
  const handleTranslationChange = (e) => {
    const { name, value } = e.target;
    setCurrentTranslation((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{currentTranslation?.id > 0 ? "Edit" : "Add"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentTranslation && (
          <Form onSubmit={handleTranslationSubmit}>
            <Form.Group className="mb-3" controlId="langCode">
              <Form.Label>Language</Form.Label>
              <Form.Select
                name="lang_code"
                value={currentTranslation.lang_code}
                onChange={handleTranslationChange}
                requireds
              >
                <LangSelect />
                {/* <option value="en">EN-English</option>
                <option value="de">DE-Dutch</option> */}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="pickup_name"
                value={currentTranslation.pickup_name}
                onChange={handleTranslationChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="pickup_description"
                value={currentTranslation.pickup_description}
                required
                onChange={handleTranslationChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                {loading ? <Spinner animation="border" size="sm" /> : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PickupTranslationModal;
