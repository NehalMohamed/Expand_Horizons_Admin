/**
 * Facility Component
 *
 * Manages facility settings and translations.
 *
 * Features:
 * - Create new facilities
 * - Update existing facilities
 * - Activate/Deactivate facilities
 * - Search facilities
 * - Manage facility translations
 * - Configure extra pricing options
 */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaUpload,
  FaPlus,
  FaGlobe,
  FaTrash,
  FaEdit,
  FaUndo,
} from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import {
  Button,
  Form,
  Col,
  Row,
  Table,
  Accordion,
  FormCheck,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../Shared/popup/PopUp";
import LoadingPage from "../Loader/LoadingPage";
import {
  GetFacilityWithTranslation,
  SaveMainFacility,
  SaveFacilityTranslation,
} from "../../slices/facilitySlice";
import FacilityTranslationModal from "./FacilityTranslationModal";
import CurrencySelect from "../Shared/MainSetting/CurrencySelect";
/**
 * Available pricing types for extra facilities.
 */
const priceTypes = [
  { id: 1, name: "Per Pax" },
  { id: 2, name: "Per Unit" },
];
function Facility() {
  const dispatch = useDispatch();
  // Facility data retrieved from Redux store
  const { facilities, loading, error } = useSelector((state) => state.facility);
  // Controls translation modal visibility
  const [showTranslationModal, setShowTranslationModal] = useState(false);

  // Currently selected translation for editing
  const [currentTranslation, setCurrentTranslation] = useState(null);

  // Search keyword used to filter facilities
  const [searchTerm, setSearchTerm] = useState("");

  // Controls popup notification visibility
  const [showPopup, setShowPopup] = useState(false);

  // Popup notification message
  const [popupMessage, setPopupMessage] = useState("");

  // Popup notification type (success, error, alert)
  const [popupType, setPopupType] = useState("alert");

  // Controls visibility of the add/edit form
  const [filterExpanded, setFilterExpanded] = useState(false);

  // Indicates whether the form is editing an existing facility
  const [isUpdate, setIsUpdate] = useState(false);
  /**
   * Facility form model.
   *
   * Used for both Add and Update operations.
   */
  const initialFormData = {
    facility_code: "",
    facility_default_name: "",
    active: true,
    id: 0,
    extra_price: 0,
    is_extra: false,
    currency_code: "",
    pricing_type: 1,
    is_obligatory: false,
  };
  const [formData, setFormData] = useState({
    facility_code: "",
    facility_default_name: "",
    active: true,
    id: 0,
    extra_price: 0,
    is_extra: false,
    currency_code: "",
    pricing_type: 1,
    is_obligatory: false,
  });

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) =>
      facility.facility_default_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [facilities, searchTerm]);
  /**
   * Updates facility form values whenever
   * an input field changes.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  const handleInputChange = (e) => {
    const [name, value] = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
  /**
   * Creates a new facility or updates
   * an existing one.
   *
   * On success:
   * - Reset the form
   * - Reload facilities
   * - Exit edit mode
   *
   * On failure:
   * - Display validation errors
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(SaveMainFacility(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        setFormData(initialFormData);
        setIsUpdate(false);
        dispatch(GetFacilityWithTranslation());
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  const loadFacilities = useCallback(() => {
    dispatch(GetFacilityWithTranslation());
  }, [dispatch]);
  /**
   * Restores the facility form
   * to its default values.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  const resetForm = (e) => {
    e.preventDefault();
    setIsUpdate(false);
    setFormData(initialFormData);
  };

  /**
   * Loads all facilities together with
   * their translations when the component
   * is first rendered.
   */
  useEffect(() => {
    loadFacilities();
    return () => {};
  }, []);
  /**
   * Loads the selected facility
   * into the edit form.
   *
   * @param {Object} facility Selected facility.
   */
  const handleEdit = (fac) => {
    setIsUpdate(true);
    setFilterExpanded(true);
    setFormData({
      facility_code: fac.facility_code,
      facility_default_name: fac.facility_default_name,
      active: fac.active,
      id: fac.facility_id,
      extra_price: fac.extra_price,
      is_extra: fac.is_extra,
      currency_code: fac.currency_code,
      pricing_type: fac.pricing_type,
      is_obligatory: fac.is_obligatory,
    });
  };
  /**
   * Activates or deactivates
   * a facility.
   *
   * @param {Object} facility Selected facility.
   */
  const handleDeleteClick = (fac) => {
    const data = {
      facility_code: fac.facility_code,
      facility_default_name: fac.facility_default_name,
      active: !fac.active,
      id: fac.facility_id,
      extra_price: fac.extra_price,
      is_extra: fac.is_extra,
      currency_code: fac.currency_code,
      pricing_type: fac.pricing_type,
      is_obligatory: fac.is_obligatory,
    };
    dispatch(SaveMainFacility(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        loadFacilities();
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  /**
   * Removes a facility translation.
   *
   * Performs a soft delete by
   * setting delete = true.
   *
   * @param {Object} translation Translation to remove.
   */
  const handleDeleteTranslation = (trans) => {
    let data = {
      id: trans.id,
      facility_id: trans.facility_id,
      lang_code: trans.lang_code,
      facility_name: trans.facility_name,
      facility_desc: trans.facility_desc,
      delete: true,
    };
    dispatch(SaveFacilityTranslation(data)).then((result) => {
      if (result.payload && result.payload.success) {
        loadFacilities();
        setShowPopup(false);
      } else {
        setShowPopup(true);
        setPopupType("error");
        setPopupMessage(result.payload.errors);
      }
    });
  };

  /**
   * Opens the translation dialog
   * for editing an existing translation.
   *
   * @param {Object} translation Translation to edit.
   */
  const handleEditTranslation = (trans) => {
    setCurrentTranslation({
      id: trans.id,
      facility_id: trans.facility_id,
      lang_code: trans.lang_code,
      facility_name: trans.facility_name,
      facility_desc: trans.facility_desc,
      delete: false,
    });
    setShowTranslationModal(true);
  };
  /**
   * Opens the translation dialog
   * for creating a new translation.
   *
   * @param {Object} facility Selected facility.
   */
  const handleAddTranslation = (fac) => {
    setCurrentTranslation({
      id: 0,
      facility_id: fac.facility_id,
      lang_code: "en",
      facility_name: "",
      facility_desc: "",
      delete: false,
    });
    setShowTranslationModal(true);
  };
  return (
    <section className="layout_section">
      <div className="d-flex justify-content-between align-items-center header_title">
        <h2 className="mb-4 page-title">Facilities Setting</h2>
        <div className="position-relative" style={{ width: "250px" }}>
          <FaSearch
            className="position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
          <input
            type="text"
            className="form-control ps-6"
            placeholder="Search facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>
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
        <>
          <Form onSubmit={onSubmit} className="mb-4 form_crud">
            <Row>
              <Col xs={12} md={4} className="mb-2 mb-md-0">
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Code"
                    name="facility_code"
                    onChange={handleInputChange}
                    value={formData.facility_code}
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
                    name="facility_default_name"
                    onChange={handleInputChange}
                    value={formData.facility_default_name}
                    required
                    className="formInput"
                  />
                </Form.Group>
              </Col>

              <Col md={4} xs={12}>
                <Form.Group className="mb-3">
                  <FormCheck
                    type="checkbox"
                    id="is_extra"
                    label="is extra"
                    name="is_extra"
                    className="checkbox_withmargin"
                    checked={formData.is_extra}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        is_extra: e.target.checked,
                      });
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {formData.is_extra ? (
                <>
                  <Col md={3} xs={12}>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        className="form-control"
                        placeholder="Enter price"
                        value={formData.extra_price}
                        name="extra_price"
                        onChange={handleInputChange}
                        required
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={3} xs={12}>
                    <Form.Group>
                      <Form.Label>Currency</Form.Label>
                      <Form.Control
                        as="select"
                        name="currency_code"
                        value={formData.currency_code}
                        onChange={handleInputChange}
                        required
                      >
                        <option value={""}>select Currency</option>
                        <CurrencySelect />
                        {/* {currencies.map((currency, index) => (
                          <option key={index} value={currency.code}>
                            {currency.code}
                          </option>
                        ))} */}
                      </Form.Control>
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
                  <Col md={3} xs={12}>
                    <Form.Group className="mb-3">
                      <FormCheck
                        type="checkbox"
                        id="is_obligatory"
                        label="is obligatory"
                        name="is_obligatory"
                        className="checkbox_withmargin"
                        checked={formData.is_obligatory}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            is_obligatory: e.target.checked,
                          });
                        }}
                      />
                    </Form.Group>
                  </Col>
                </>
              ) : null}

              {isUpdate ? (
                <>
                  <Col xs={12} md={{ span: 2, offset: 8 }}>
                    {" "}
                    <Button
                      className="darkBlue-Btn FullWidthBtn"
                      type="submit"
                      style={{ marginTop: "30px" }}
                    >
                      <FaUpload className="me-1" /> update
                    </Button>
                  </Col>
                  <Col xs={12} md={2}>
                    <Button
                      className="purble-btn FullWidthBtn"
                      onClick={resetForm}
                      style={{ marginTop: "30px" }}
                    >
                      <FiRefreshCcw className="me-1" /> Reset
                    </Button>
                  </Col>
                </>
              ) : (
                <Col
                  xs={12}
                  md={formData.is_extra ? 4 : { span: 4, offset: 8 }}
                >
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 darkBlue-Btn FullWidthBtn"
                    style={{ marginTop: "30px" }}
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
        {facilities &&
          filteredFacilities?.map((row, index) => (
            <Accordion key={index}>
              <Accordion.Item eventKey={index}>
                <Accordion.Header
                  className={
                    row.active == true
                      ? "ActiveHeader custom_accord"
                      : "InActiveHeader custom_accord"
                  }
                >
                  <div className="d-flex justify-content-between w-100 align-items-center">
                    <span>
                      {row.facility_code} - {row.facility_default_name}
                    </span>
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
                        {row.active == true ? <FaTrash /> : <FaUndo />}
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
                            <td>{trans.facility_name}</td>
                            <td>{trans.facility_desc}</td>
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
      {loading ? <LoadingPage /> : null}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
      {/* Translation Modal */}
      <FacilityTranslationModal
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

export default Facility;
