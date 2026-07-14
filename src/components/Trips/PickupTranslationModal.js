/**
 * -----------------------------------------------------------------------------
 * PickupTranslationModal Component
 * -----------------------------------------------------------------------------
 * Purpose:
 * Displays a modal for adding or editing pickup point translations for a trip.
 * This component allows administrators to maintain multilingual pickup names
 * and descriptions used throughout the booking system.
 *
 * Features:
 * - Add a new pickup translation.
 * - Edit an existing pickup translation.
 * - Select translation language.
 * - Save translation using Redux actions.
 * - Refresh pickup translations after a successful save.
 * - Display loading indicator while saving.
 * - Show popup messages for validation or server errors.
 *
 * Props:
 * @param {boolean} show - Controls modal visibility.
 * @param {Function} setShow - Opens/closes the modal.
 * @param {number} trip_id - Current trip identifier.
 * @param {Object} currentTranslation - Translation being added or edited.
 * @param {Function} setCurrentTranslation - Updates translation state.
 * @param {Function} setPopupMessage - Sets popup message text.
 * @param {Function} setPopupType - Sets popup type (success/error).
 * @param {Function} setShowPopup - Controls popup visibility.
 *
 * Redux:
 * - SaveTripPickupsTranslations()
 * - GetPickupsAllForTrip()
 * -----------------------------------------------------------------------------
 */

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

  // Get loading state from Redux store
  const { loading } = useSelector((state) => state.trips);

  // Save the translation
  const handleTranslationSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(SaveTripPickupsTranslations(currentTranslation)).then(
        (result) => {
          if (result.payload && result.payload.success) {
            // Reload pickup list after successful save
            let data = { trip_id: Number(trip_id), trip_type: 1 };
            dispatch(GetPickupsAllForTrip(data));

            // Close modal
            setShow(false);
          } else {
            // Display validation or API errors
            setShowPopup(true);
            setPopupType("error");
            setPopupMessage(result.payload.errors);
          }
        },
      );
    } catch (error) {
      // Handle unexpected runtime errors
      const errorMessage =
        typeof error === "string"
          ? error
          : error.message || "Failed to save translation";

      setPopupMessage(errorMessage);
      setPopupType("error");
      setShowPopup(true);
    }
  };

  // Update translation form fields
  const handleTranslationChange = (e) => {
    const { name, value } = e.target;

    setCurrentTranslation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        {/* Modal title changes based on add/edit mode */}
        <Modal.Title>{currentTranslation?.id > 0 ? "Edit" : "Add"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {currentTranslation && (
          <Form onSubmit={handleTranslationSubmit}>
            {/* Language Selection */}
            <Form.Group className="mb-3" controlId="langCode">
              <Form.Label>Language</Form.Label>

              <Form.Select
                name="lang_code"
                value={currentTranslation.lang_code}
                onChange={handleTranslationChange}
                required
              >
                <LangSelect />
              </Form.Select>
            </Form.Group>

            {/* Pickup Name */}
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

            {/* Pickup Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>

              <Form.Control
                type="text"
                name="pickup_description"
                value={currentTranslation.pickup_description}
                onChange={handleTranslationChange}
                required
              />
            </Form.Group>

            {/* Save Button */}
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
