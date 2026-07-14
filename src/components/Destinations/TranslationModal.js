import React from "react";
import { Modal, Spinner, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  SaveDestinationTranslations,
  GetDestinations,
} from "../../slices/destinationSlice";
import LangSelect from "../Shared/MainSetting/LangSelect";

/**
 * TranslationModal Component
 *
 * Displays a modal for creating or editing
 * destination translations.
 *
 * Features:
 * - Add a new translation
 * - Edit an existing translation
 * - Save translation to the database
 * - Refresh destination list after saving
 * - Display loading state while saving
 *
 * @param {boolean} show Controls modal visibility.
 * @param {Function} setShow Updates modal visibility.
 * @param {Object} currentTranslation Translation currently being edited.
 * @param {Function} setCurrentTranslation Updates translation state.
 * @param {Function} setPopupMessage Displays popup message.
 * @param {Function} setPopupType Sets popup type (success, error, etc.).
 * @param {Function} setShowPopup Controls popup visibility.
 */
const TranslationModal = ({
  show,
  setShow,
  currentTranslation,
  setCurrentTranslation,
  setPopupMessage,
  setPopupType,
  setShowPopup,
}) => {
  // Redux dispatcher
  const dispatch = useDispatch();

  // Loading state while saving translations
  const { loading } = useSelector((state) => state.destinations);

  /**
   * Saves the current translation.
   *
   * On success:
   * - Close the modal
   * - Reload destination list
   *
   * On failure:
   * - Display validation errors
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleTranslationSubmit = async (event) => {
    event.preventDefault();

    dispatch(SaveDestinationTranslations(currentTranslation)).then((result) => {
      if (result.payload && result.payload.success) {
        setShow(false);

        // Refresh destination list after saving
        dispatch(
          GetDestinations({
            country_code: "",
            lang_code: "en",
            currency_code: "",
          }),
        );
      } else {
        setShowPopup(true);
        setPopupType("error");
        setPopupMessage(result.payload.errors);
      }
    });
  };

  /**
   * Updates the translation model whenever
   * an input field value changes.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  const handleTranslationChange = (event) => {
    const { name, value } = event.target;

    setCurrentTranslation((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      {/* Modal Header */}
      <Modal.Header closeButton>
        <Modal.Title>
          {currentTranslation?.id ? "Edit Translation" : "Add Translation"}
        </Modal.Title>
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

            {/* Destination Name */}
            <Form.Group className="mb-3">
              <Form.Label>Destination Name</Form.Label>

              <Form.Control
                type="text"
                name="dest_name"
                value={currentTranslation.dest_name}
                onChange={handleTranslationChange}
                required
              />
            </Form.Group>

            {/* Destination Description */}
            <Form.Group className="mb-3">
              <Form.Label>Destination Description</Form.Label>

              <Form.Control
                type="text"
                name="dest_description"
                value={currentTranslation.dest_description}
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

export default TranslationModal;
