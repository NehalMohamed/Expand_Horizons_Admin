import React, { useEffect, useState } from "react";
import { SaveTripTranslation } from "../../slices/tripSlice";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { Form, Tab, Row, Col, Button } from "react-bootstrap";
import Editor from "react-simple-wysiwyg";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
function TranslationTab({ data, trip_id, lang_code, RefreshList }) {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    trip_id: trip_id,
    lang_code: "",
    trip_name: "",
    trip_description: "",
    trip_includes: "",
    trip_highlight: "",
    trip_details: "",
    important_info: "",
    trip_not_includes: "",
    delete: false,
    cancelation_policy: "",
  });
  const { loading, error } = useSelector((state) => state.trips);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (data != null) {
      setFormData({
        id: Number(data.id),
        trip_id: trip_id,
        lang_code: lang_code,
        trip_name: data.trip_name,
        trip_description: data.trip_description,
        trip_includes: data.trip_includes,
        trip_highlight: data.trip_highlight,
        trip_details: data.trip_details,
        important_info: data.important_info,
        trip_not_includes: data.trip_not_includes,
        delete: false,
        cancelation_policy: data.cancelation_policy,
      });
    } else {
      setFormData({
        id: 0,
        trip_id: trip_id,
        lang_code: "",
        trip_name: "",
        trip_description: "",
        trip_includes: "",
        trip_highlight: "",
        trip_details: "",
        important_info: "",
        trip_not_includes: "",
        delete: false,
        cancelation_policy: "",
      });
    }
    return () => {
      setFormData({
        id: 0,
        trip_id: 0,
        lang_code: "",
        trip_name: "",
        trip_description: "",
        trip_includes: "",
        trip_highlight: "",
        trip_details: "",
        important_info: "",
        trip_not_includes: "",
        delete: false,
        cancelation_policy: "",
      });
    };
  }, [data]);

  const saveData = (e, isDelete) => {
    e.preventDefault();
    formData["delete"] = isDelete;
    formData["lang_code"] = lang_code;
    dispatch(SaveTripTranslation(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        setIsUpdate(false);
        RefreshList();
        //dispatch(GetTripTranslationGrp(trip_id));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  return (
    <>
      {/* onSubmit={saveData} */}
      <Form>
        {" "}
        <Row>
          <Form.Label column="lg" lg={2}>
            Name
          </Form.Label>
          <Col>
            <Form.Control
              type="text"
              placeholder="name"
              name="trip_name"
              value={formData.trip_name}
              onChange={handleInputChange}
              required
              className="formInput"
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Form.Label column="lg" lg={2}>
            description
          </Form.Label>
          <Col>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                name="trip_description"
                value={formData.trip_description}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* <Editor
              name="trip_description"
              containerProps={{ style: { resize: "vertical" } }}
              value={formData.trip_description}
              onChange={handleInputChange}
            /> */}
          </Col>
        </Row>
        <hr />
        <Row>
          <Form.Label column="lg" lg={2}>
            cancelation policy
          </Form.Label>
          <Col>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="cancelation_policy"
                name="cancelation_policy"
                value={formData.cancelation_policy}
                onChange={handleInputChange}
                className="formInput"
              />
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Row>
          <Form.Label column="lg" lg={2}>
            Details
          </Form.Label>
          <Col>
            <Editor
              name="trip_details"
              containerProps={{ style: { resize: "vertical" } }}
              value={formData.trip_details}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Form.Label column="lg" lg={2}>
            highlight
          </Form.Label>
          <Col>
            <Editor
              name="trip_highlight"
              containerProps={{ style: { resize: "vertical" } }}
              value={formData.trip_highlight}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Form.Label column="lg" lg={2}>
            Includes
          </Form.Label>
          <Col>
            <Editor
              name="trip_includes"
              containerProps={{ style: { resize: "vertical" } }}
              value={formData.trip_includes}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Form.Label column="lg" lg={2}>
            Not Includes.
          </Form.Label>
          <Col>
            <Editor
              name="trip_not_includes"
              containerProps={{ style: { resize: "vertical" } }}
              value={formData.trip_not_includes}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Form.Label column="lg" lg={2}>
            Important Info.
          </Form.Label>
          <Col>
            <Editor
              name="important_info"
              containerProps={{ style: { resize: "vertical" } }}
              value={formData.important_info}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row>
          {data == null ? (
            <Col xs={12} md={{ span: 4, offset: 8 }}>
              <Button
                variant="primary"
                type="submit"
                className="darkBlue-Btn FullWidthBtn"
                onClick={(e) => saveData(e, false)}
              >
                <FaPlus className="me-1" /> Add
              </Button>
            </Col>
          ) : (
            <>
              <Col xs={12} md={{ span: 3, offset: 6 }}>
                <Button
                  variant="primary"
                  type="submit"
                  className="red-btn FullWidthBtn"
                  onClick={(e) => saveData(e, true)}
                >
                  <FaTrash className="me-1" /> Delete
                </Button>
              </Col>
              <Col xs={12} md={3}>
                <Button
                  variant="primary"
                  type="submit"
                  className="darkBlue-Btn FullWidthBtn"
                  onClick={(e) => saveData(e, false)}
                >
                  <FaUpload className="me-1" /> Update
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Form>

      {loading ? <LoadingPage /> : null}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
    </>
  );
}

export default TranslationTab;
