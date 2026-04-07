import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  GetDestinations,
  SaveMainDestination,
  SaveDestinationTranslations,
  GetDestination_Mains,
} from "../../slices/destinationSlice";
import { Form, Row, Col, Button, FormCheck } from "react-bootstrap";
import { Countries } from "../../helper/Countries";
import {
  FaPlus,
  FaTrash,
  FaChevronUp,
  FaEdit,
  FaGlobe,
  FaChevronDown,
  FaUpload,
  FaCheck,
} from "react-icons/fa";
import PopUp from "../Shared/popup/PopUp";
import LoadingPage from "../Loader/LoadingPage";
import { Table } from "react-bootstrap";
import TranslationModal from "./TranslationModal";
import { FiRefreshCcw } from "react-icons/fi";
import { FaX } from "react-icons/fa6";
function DestinationComp() {
  const dispatch = useDispatch();
  const { destinations, loading, error, DestinationMain } = useSelector(
    (state) => state.destinations
  );
  const [touched, setTouched] = useState(false);
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [currentMainDest, setCurrentMainDest] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState(null); // State for current translation being edited
  const [expandedRows, setExpandedRows] = useState([]); // State for expanded rows (translations)
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [isUpdate, setIsUpdate] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    dest_default_name: "",
    dest_code: "",
    active: true,
    country_code: "",
    route: "",
    parent_id: 0,
    leaf: false,
    order: 1,
  }); // Form state for save Destinations

  const slugRegex = /^(?!-)(?!.*--)[a-zA-Z0-9-]+(?<!-)$/;
  const isValidSlug =
    formData.route.length === 0 || slugRegex.test(formData.route);
  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // Fetch services and packages on component mount
  useEffect(() => {
    let data = { country_code: "", lang_code: "en", currency_code: "" };
    dispatch(GetDestinations(data));
    dispatch(GetDestination_Mains(false));
  }, [dispatch]);
  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isValidSlug) {
      // Proceed with submission logic
      dispatch(SaveMainDestination(formData)).then((result) => {
        if (result.payload && result.payload.success) {
          setShowPopup(false);
          setFormData({
            id: 0,
            dest_default_name: "",
            dest_code: "",
            active: true,
            country_code: "",
            route: "",
            parent_id: 0,
            leaf: false,
            order: 1,
          });
          let data = { country_code: "", lang_code: "en", currency_code: "" };
          dispatch(GetDestinations(data));
        } else {
          setShowPopup(true);
          setPopupMessage(result.payload.errors);
        }
        setIsUpdate(false);
        setFilterExpanded(false);
      });
    }
  };
  const resetForm = () => {
    setFormData({
      id: 0,
      dest_default_name: "",
      dest_code: "",
      active: true,
      country_code: "",
      route: "",
      parent_id: 0,
      leaf: false,
      order: 1,
    });
    setIsUpdate(false);
  };
  // Handle editing a destination
  const handleEdit = async (dest) => {
    setIsUpdate(true);
    setFilterExpanded(true);
    setFormData({
      id: dest.destination_id,
      dest_default_name: dest.dest_default_name,
      dest_code: dest.dest_code,
      active: true,
      country_code: dest.country_code,
      route: dest.route,
      parent_id: dest.parent_id,
      leaf: dest.leaf,
      order: dest.order,
    });
  };

  // Handle deleting a destination
  const handleDeleteClick = (dest) => {
    let row = {
      id: dest.destination_id,
      dest_default_name: dest.dest_default_name,
      dest_code: dest.dest_code,
      active: false,
      country_code: dest.country_code,
      route: dest.route,
      parent_id: dest.parent_id,
      leaf: dest.leaf,
      order: dest.order,
    };
    dispatch(SaveMainDestination(row)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        setFormData({
          id: 0,
          dest_default_name: "",
          dest_code: "",
          active: true,
          country_code: "",
          route: "",
          parent_id: 0,
          leaf: false,
          order: 1,
        });
        let data = { country_code: "", lang_code: "en", currency_code: "" };
        dispatch(GetDestinations(data));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };

  // Handle adding a translation
  const handleAddTranslation = (dest) => {
    setCurrentMainDest(dest);
    setCurrentTranslation({
      id: 0,
      destination_id: dest.destination_id,
      lang_code: "en",
      dest_name: "",
      dest_description: "",
      active: true,
    });
    setShowTranslationModal(true);
  };

  // Handle deleting a translation
  const handleDeleteTranslationClick = (translation) => {
    let row = {
      id: translation.id,
      destination_id: translation.destination_id,
      lang_code: translation.lang_code,
      dest_name: translation.dest_name,
      dest_description: translation.dest_description,
      active: false,
    };
    dispatch(SaveDestinationTranslations(row)).then((result) => {
      if (result.payload && result.payload.success) {
        let data = { country_code: "", lang_code: "en", currency_code: "" };
        dispatch(GetDestinations(data));
      } else {
        setShowPopup(true);
        setPopupType("error");
        setPopupMessage(result.payload.errors);
      }
    });
  };

  const toggleRow = (id) => {
    const currentExpandedRows = [...expandedRows];
    const isRowExpanded = currentExpandedRows.includes(id);
    setExpandedRows(
      isRowExpanded
        ? currentExpandedRows.filter((rowId) => rowId !== id)
        : [...currentExpandedRows, id]
    );
  };

  // Render translation header row
  const renderTranslationHeader = () => {
    return (
      <tr className="translation-header">
        {/* <th>Language</th>
        <th>Name</th>
        <th>Description</th>
        <th>Actions</th> */}
        <td colSpan="8">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex" style={{ width: "85%" }}>
              <div style={{ width: "15%" }}>
                <strong>Language</strong>
              </div>
              <div style={{ width: "25%" }}>
                <strong>Name</strong>
              </div>
              <div style={{ width: "25%" }}>
                <strong>Description</strong>
              </div>
            </div>
            <div>
              <strong>Actions</strong>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // Render translation row
  const renderTranslationRow = (translation) => {
    return (
      <tr key={`translation-${translation.id}`} className="translation-row">
        {/* <td>{translation.lang_code}</td>
        <td>{translation.dest_name}</td>
        <td>{translation.dest_description}</td>
        <td>
          {" "}
          <button
            className="btn btn-sm btn-warning me-2 yellow-btn"
            onClick={() => {
              setCurrentTranslation(translation);
              setShowTranslationModal(true);
            }}
            title="Edit Translation"
          >
            <FaEdit size={12} />
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteTranslationClick(translation)}
            title="Delete Translation"
          >
            <FaTrash size={12} />
          </button>
        </td> */}
        {translation.lang_code != null ? (
          <td colSpan="8">
            <div className="d-flex justify-content-between align-items-center">
              <div style={{ width: "85%", display: "flex" }}>
                <div style={{ width: "15%" }}>{translation.lang_code}</div>
                <div style={{ width: "25%" }}>{translation.dest_name}</div>
                <div style={{ width: "25%" }}>
                  {translation.dest_description}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2 yellow-btn"
                  onClick={() => {
                    setCurrentTranslation(translation);
                    setShowTranslationModal(true);
                  }}
                  title="Edit Translation"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteTranslationClick(translation)}
                  title="Delete Translation"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          </td>
        ) : (
          <td colSpan="5">
            <div>No Data</div>
          </td>
        )}
      </tr>
    );
  };
  const shouldShowError =
    (dirty || touched) && !isValidSlug && formData.route?.length > 0;
  return (
    <section className="layout_section">
      <div className="d-flex justify-content-between align-items-center header_title">
        <h2 className="mb-4 page-title">Destination Setting</h2>
        <Button
          variant="light"
          onClick={() => setFilterExpanded(!filterExpanded)}
          className="filter-toggle-btn mb-4"
        >
          {filterExpanded ? <FaChevronUp /> : <FaChevronDown />}
          <span className="ms-2">Add</span>
        </Button>
      </div>
      {filterExpanded && (
        <div className="dest_form">
          <Form onSubmit={onSubmit} className="mb-4 form_crud">
            <Row>
              <Col xs={12} md={4} className="mb-2 mb-md-0">
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Code"
                    name="dest_code"
                    onChange={handleInputChange}
                    value={formData.dest_code}
                    required
                    className="formInput"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} className="mb-2 mb-md-0">
                <Form.Group className="mb-3">
                  <Form.Label>Default Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="default name"
                    name="dest_default_name"
                    onChange={handleInputChange}
                    value={formData.dest_default_name}
                    required
                    className="formInput"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} className="mb-2 mb-md-0">
                <Form.Group controlId="service">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    name="country_code"
                    onChange={handleInputChange}
                    value={formData.country_code}
                    required
                    className="formInput"
                  >
                    <option value="">select Country Code</option>
                    {Countries &&
                      Countries?.map((country, index) => (
                        <option key={index} value={country.code}>
                          {country.code}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} className="mb-2 mb-md-0">
                <Form.Group className="mb-3">
                  <Form.Label>Route</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="route"
                    name="route"
                    onChange={(e) => {
                      if (!dirty) setDirty(true);
                      handleInputChange(e);
                    }}
                    required
                    value={formData.route}
                    className="formInput"
                    onBlur={() => setTouched(true)}
                    isInvalid={shouldShowError}
                    isValid={
                      formData.route?.length > 0 &&
                      (touched || dirty) &&
                      isValidSlug
                    }
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "12px" }}
                  >
                    Only letters, numbers, and hyphens are allowed. No spaces,
                    special characters, or leading/trailing hyphens.
                  </Form.Control.Feedback>
                  {/* <Form.Control.Feedback type="valid">
                    Looks good!
                  </Form.Control.Feedback> */}
                </Form.Group>
              </Col>
              <Col md={4}>
                {" "}
                <Form.Group>
                  <Form.Label>Parent</Form.Label>
                  <Form.Control
                    as="select"
                    name="parent_id"
                    onChange={handleInputChange}
                    value={formData.parent_id}
                    className="formInput"
                  >
                    <option value="">select Parent</option>
                    {DestinationMain &&
                      DestinationMain?.map((dest, index) => (
                        <option key={index} value={dest.id}>
                          {dest.dest_code} - {dest.dest_default_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={2} xs={12}>
                <Form.Label>Order</Form.Label>
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
              <Col md={2} xs={12}>
                <Form.Group className="mb-3">
                  <FormCheck
                    className="checkbox_withmargin"
                    type="checkbox"
                    id="leaf"
                    label="leaf"
                    name="leaf"
                    checked={formData.leaf}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        leaf: e.target.checked,
                      });
                    }}
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
                      disabled={isValidSlug == false}
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
                <Col xs={12} md={{ span: 3, offset: 9 }}>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-30 darkBlue-Btn FullWidthBtn"
                    disabled={isValidSlug == false}
                  >
                    <FaPlus className="me-1" /> Add
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        </div>
      )}

      <div className="result_list">
        {" "}
        <Table responsive>
          <thead>
            <tr className="main_row">
              <th>Code</th>
              <th>Name</th>
              <th>Country</th>
              <th>Route</th>
              <th>Parent</th>
              <th>Leaf</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {destinations &&
              destinations.map((dest, index) => (
                <React.Fragment key={dest.destination_id}>
                  <tr
                    className={
                      !dest.active
                        ? "main_row_data inactive-row"
                        : "main_row_data"
                    }
                  >
                    <td>
                      {dest.translations?.length > 0 && (
                        <button
                          className="expand-button me-3"
                          onClick={() => toggleRow(dest.destination_id)}
                        >
                          {expandedRows.includes(dest.destination_id) ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </button>
                      )}
                      {dest.dest_code}
                    </td>
                    <td>{dest.dest_default_name}</td>
                    <td>{dest.country_code}</td>
                    <td>{dest.route}</td>
                    <td>{dest.parent_name}</td>
                    <td>
                      {dest.leaf ? (
                        <FaCheck className="check_icon" />
                      ) : (
                        <FaX className="x_icon" />
                      )}
                    </td>
                    <td>{dest.order}</td>
                    <td>
                      <div className="d-flex">
                        <button
                          className="btn btn-sm action_btn green-btn"
                          onClick={() => handleAddTranslation(dest)}
                          title="Add Translation"
                        >
                          <FaGlobe />
                        </button>
                        <button
                          className="btn btn-sm action_btn yellow-btn"
                          onClick={() => handleEdit(dest)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger action_btn"
                          onClick={() => handleDeleteClick(dest)}
                          title="Delete"
                          disabled={!dest.active}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.includes(dest.destination_id) &&
                    dest.translations?.length > 0 && (
                      <>
                        {renderTranslationHeader()}
                        {dest.translations?.map((translation) =>
                          renderTranslationRow(translation)
                        )}
                      </>
                    )}
                </React.Fragment>
              ))}
          </tbody>
        </Table>
      </div>
      {loading ? <LoadingPage /> : null}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
      {/* Translation Modal */}
      <TranslationModal
        show={showTranslationModal}
        setShow={setShowTranslationModal}
        currentTranslation={currentTranslation}
        setCurrentTranslation={setCurrentTranslation}
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />
    </section>
  );
}

export default DestinationComp;
