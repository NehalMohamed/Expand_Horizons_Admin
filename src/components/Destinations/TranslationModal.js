import React from "react";
import { Modal, Spinner, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  SaveDestinationTranslations,
  GetDestinations,
} from "../../slices/destinationSlice";
import LangSelect from "../Shared/MainSetting/LangSelect";
const TranslationModal = ({
  show,
  setShow,
  currentTranslation,
  setCurrentTranslation,
  setPopupMessage,
  setPopupType,
  setShowPopup,
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.destinations); // Get translation status from Redux store
  // Handle translation submission
  const handleTranslationSubmit = async (e) => {
    e.preventDefault();
    dispatch(SaveDestinationTranslations(currentTranslation)).then((result) => {
      if (result.payload && result.payload.success) {
        setShow(false);
        let data = { country_code: "", lang_code: "en", currency_code: "" };
        dispatch(GetDestinations(data));
      } else {
        setShowPopup(true);
        setPopupType("error");
        setPopupMessage(result.payload.errors);
      }
    });
  };

  // Handle translation input changes
  const handleTranslationChange = (e) => {
    const { name, value } = e.target;
    setCurrentTranslation((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentTranslation?.id ? "Edit Translation" : "Add Translation"}
        </Modal.Title>
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
              <Form.Label>Destination Name</Form.Label>
              <Form.Control
                type="text"
                name="dest_name"
                value={currentTranslation.dest_name}
                onChange={handleTranslationChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>destination Description</Form.Label>
              <Form.Control
                type="text"
                name="dest_description"
                value={currentTranslation.dest_description}
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

export default TranslationModal;
