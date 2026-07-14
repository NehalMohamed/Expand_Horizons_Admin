/**
 * FacilityTranslationModal Component
 *
 * Displays a modal for creating or editing
 * facility translations.
 *
 * Features:
 * - Add a new translation
 * - Edit an existing translation
 * - Save translation to the database
 * - Refresh facility list after saving
 * - Display loading indicator while saving
 *
 * @param {boolean} show Controls modal visibility.
 * @param {Function} setShow Updates modal visibility.
 * @param {Object} currentTranslation Translation currently being edited.
 * @param {Function} setCurrentTranslation Updates translation state.
 * @param {Function} setPopupMessage Displays popup message.
 * @param {Function} setPopupType Sets popup type (success, error, etc.).
 * @param {Function} setShowPopup Controls popup visibility.
 */
import React from "react";
import { Modal, Spinner, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  SaveFacilityTranslation,
  GetFacilityWithTranslation,
} from "../../slices/facilitySlice";
import LangSelect from "../Shared/MainSetting/LangSelect";

const FacilityTranslationModal = ({
  show,
  setShow,
  currentTranslation,
  setCurrentTranslation,
  setPopupMessage,
  setPopupType,
  setShowPopup,
}) => {
  const dispatch = useDispatch();
  // Loading state while saving facility translations
  const { loading } = useSelector((state) => state.facility); // Get translation status from Redux store

  /**
   * Saves the current facility translation.
   *
   * On success:
   * - Refresh the facility list
   * - Close the translation modal
   *
   * On failure:
   * - Display validation or server errors
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleTranslationSubmit = (e) => {
    e.preventDefault();
    // try {
    dispatch(SaveFacilityTranslation(currentTranslation)).then((result) => {
      if (result.payload && result.payload.success) {
        // Reload facilities to display the latest translations.
        dispatch(GetFacilityWithTranslation());
        setShow(false);
      } else {
        setShowPopup(true);
        setPopupType("error");
        setPopupMessage(result.payload.errors);
      }
    });
    // }
    // catch (error) {
    //   const errorMessage =
    //     typeof error === "string"
    //       ? error
    //       : error.message || "Failed to save  translation";
    //   setPopupMessage(errorMessage);
    //   setPopupType("error");
    //   setShowPopup(true);
    // }
  };

  /**
   * Updates the translation model whenever
   * an input value changes.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
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
                required
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
                name="facility_name"
                value={currentTranslation.facility_name}
                onChange={handleTranslationChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="facility_desc"
                value={currentTranslation.facility_desc}
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

export default FacilityTranslationModal;
