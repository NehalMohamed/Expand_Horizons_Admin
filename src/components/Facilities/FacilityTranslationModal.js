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
  const { loading } = useSelector((state) => state.facility); // Get translation status from Redux store

  // Handle translation submission
  const handleTranslationSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SaveFacilityTranslation(currentTranslation)).then((result) => {
        if (result.payload && result.payload.success) {
          dispatch(GetFacilityWithTranslation());
          setShow(false);
        } else {
          setShowPopup(true);
          setPopupType("error");
          setPopupMessage(result.payload.errors);
        }
      });
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
