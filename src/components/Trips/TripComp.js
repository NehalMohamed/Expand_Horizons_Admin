import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  GetTrip_Mains,
  SaveMainTrip,
  GetTripCategories,
  GetTransfer_Categories,
} from "../../slices/tripSlice";
import { GetDestination_Mains } from "../../slices/destinationSlice";
import {
  Form,
  Row,
  Col,
  Button,
  FormCheck,
  Table,
  InputGroup,
} from "react-bootstrap";
import {
  FaPlus,
  FaTrash,
  FaChevronUp,
  FaEdit,
  FaGlobe,
  FaChevronDown,
  FaImage,
  FaCheck,
  FaSearch,
  FaUpload,
  FaTimes,
  FaUndo,
  FaDollarSign,
  FaEyeSlash,
} from "react-icons/fa";
import PopUp from "../Shared/popup/PopUp";
import LoadingPage from "../Loader/LoadingPage";
import { FaDeleteLeft, FaX } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import "./trips.scss";
import { FiDelete } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function TripComp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
  const [SearchCategory, setSearchCategory] = useState("");
  const [destination_id, setDestinationId] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [activeTrip, setActiveTrip] = useState({});
  const [isChecked, setIsChecked] = useState({});
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    trip_default_name: "",
    trip_code: "",
    active: true,
    trip_duration: "",
    pickup: "",
    show_in_top: false,
    show_in_slider: false,
    destination_id: 0,
    route: "",
    trip_type: 0,
    transfer_category_id: 0,
    release_days: 1,
    trip_order: 0,
    is_comm_soon: false,
    trip_code_auto: "",
  });
  const slugRegex = /^(?!-)(?!.*--)[a-zA-Z0-9-]+(?<!-)$/;
  const isValidSlug =
    formData.route?.length === 0 || slugRegex.test(formData.route);
  const { TripsMain, loading, error, TripCategories, TransferCategories } =
    useSelector((state) => state.trips);
  const { DestinationMain } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(GetTripCategories());
    dispatch(GetDestination_Mains(true));
    let data = { destination_id: destination_id, trip_type: 0 };
    dispatch(GetTrip_Mains(data));
    return () => {};
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const resetForm = () => {
    setIsUpdate(false);
    setFormData({
      id: 0,
      trip_default_name: "",
      trip_code: "",
      active: true,
      trip_duration: "",
      pickup: "",
      show_in_top: false,
      show_in_slider: false,
      destination_id: 0,
      route: "",
      trip_type: 0,
      transfer_category_id: 0,
      release_days: 1,
      trip_order: 0,
      is_comm_soon: false,
      trip_code_auto: "",
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isValidSlug) {
      dispatch(SaveMainTrip(formData)).then((result) => {
        if (result.payload && result.payload.success) {
          setShowPopup(false);
          setFormData({
            id: 0,
            trip_default_name: "",
            trip_code: "",
            active: true,
            trip_duration: "",
            pickup: "",
            show_in_top: false,
            show_in_slider: false,
            destination_id: 0,
            route: "",
            trip_type: 0,
            transfer_category_id: 0,
            release_days: 1,
            trip_order: 0,
            is_comm_soon: false,
            trip_code_auto: "",
          });
          setIsUpdate(false);
          let data = { destination_id: 0, trip_type: 0 };
          dispatch(GetTrip_Mains(data));
        } else {
          setShowPopup(true);
          setPopupMessage(result.payload.errors);
        }
      });
    }
  };
  const handleEdit = (trip) => {
    setIsUpdate(true);
    setFilterExpanded(true);
    setFormData({
      id: trip.id,
      trip_default_name: trip.trip_default_name,
      trip_code: trip.trip_code,
      active: true,
      trip_duration: trip.trip_duration,
      pickup: trip.pickup,
      show_in_top: trip.show_in_top,
      show_in_slider: trip.show_in_slider,
      destination_id: trip.destination_id,
      route: trip.route,
      trip_type: trip.trip_type,
      transfer_category_id: trip.transfer_category_id,
      release_days: trip.release_days,
      trip_order: trip.trip_order,
      is_comm_soon: trip.is_comm_soon,
      trip_code_auto: trip.trip_code_auto,
    });
  };
  const handleDelete = (trip, isDelete) => {
    const data = {
      id: trip.id,
      trip_default_name: trip.trip_default_name,
      trip_code: trip.trip_code,
      active: isDelete ? false : true,
      trip_duration: trip.trip_duration,
      pickup: trip.pickup,
      show_in_top: trip.show_in_top,
      show_in_slider: trip.show_in_slider,
      destination_id: trip.destination_id,
      route: trip.route,
      trip_type: trip.trip_type,
      transfer_category_id: trip.transfer_category_id,
      release_days: trip.release_days,
      trip_order: trip.trip_order,
      is_comm_soon: trip.is_comm_soon,
      trip_code_auto: trip.trip_code_auto,
    };
    dispatch(SaveMainTrip(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        let data = { destination_id: 0, trip_type: 0 };
        dispatch(GetTrip_Mains(data));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  const shouldShowError =
    (dirty || touched) && !isValidSlug && formData.route?.length > 0;
  return (
    <section className="layout_section">
      <div className="d-flex justify-content-between align-items-center header_title">
        <h2 className="mb-4 page-title">Trips Setting</h2>
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
            placeholder="Search trip..."
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
        <Form className="AddEdit_form form_crud" onSubmit={onSubmit}>
          <Row>
            <Col md={3}>
              {" "}
              <Form.Group className="mb-3">
                <Form.Label>Default Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="default name"
                  name="trip_default_name"
                  value={formData.trip_default_name}
                  onChange={handleInputChange}
                  required
                  className="formInput"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              {" "}
              <Form.Group className="mb-3">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Code"
                  name="trip_code"
                  onChange={handleInputChange}
                  required
                  value={formData.trip_code}
                  className="formInput"
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              {" "}
              <Form.Group>
                <Form.Label>Destination</Form.Label>
                <Form.Control
                  as="select"
                  name="destination_id"
                  onChange={handleInputChange}
                  value={formData.destination_id}
                  required
                  className="formInput"
                >
                  <option value="">select Destination</option>
                  {DestinationMain &&
                    DestinationMain?.map((dest, index) => (
                      <option key={index} value={dest.id}>
                        {dest.dest_code} - {dest.dest_default_name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              {" "}
              <Form.Group>
                <Form.Label>Trip Category</Form.Label>
                <Form.Control
                  as="select"
                  name="trip_type"
                  onChange={handleInputChange}
                  value={formData.trip_type}
                  required
                  className="formInput"
                >
                  <option value="">select category</option>
                  {TripCategories &&
                    TripCategories?.map((cat, index) => (
                      <option key={index} value={cat.id}>
                        {cat.type_code} - {cat.type_name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/* {formData.trip_type == 2 ? (
              <Col md={2}>
                {" "}
                <Form.Group>
                  <Form.Label>Transfer Category</Form.Label>
                  <Form.Control
                    as="select"
                    name="transfer_category_id"
                    onChange={handleInputChange}
                    value={formData.transfer_category_id}
                    required
                    className="formInput"
                  >
                    <option value="">select transfer</option>
                    {TransferCategories &&
                      TransferCategories?.map((ts, index) => (
                        <option key={index} value={ts.id}>
                          {ts.category_code} - {ts.category_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            ) : null} */}
            <Col md={3}>
              {" "}
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
              </Form.Group>
            </Col>
            <Col md={3} xs={12}>
              <Form.Group className="mb-3" controlId="packageName">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="duration"
                  name="trip_duration"
                  onChange={handleInputChange}
                  required
                  value={formData.trip_duration}
                  className="formInput"
                />
              </Form.Group>
            </Col>
            <Col md={3} xs={12}>
              <Form.Group className="mb-3" controlId="packageName">
                <Form.Label>PickUp</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="pickup"
                  name="pickup"
                  value={formData.pickup}
                  onChange={handleInputChange}
                  className="formInput"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>release days</Form.Label>
                <Form.Control
                  type="number"
                  className="form-control"
                  placeholder="Enter value"
                  value={formData.release_days}
                  name="release_days"
                  onChange={handleInputChange}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {" "}
            <Col md={2} xs={12}>
              <Form.Label>Order</Form.Label>
              <Form.Group className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="order"
                  name="trip_order"
                  onChange={handleInputChange}
                  className="formInput"
                  value={formData.trip_order}
                />
              </Form.Group>
            </Col>
            <Col md={2} xs={12}>
              <Form.Group className="mb-3">
                <FormCheck
                  type="checkbox"
                  id="show_in_top"
                  label="show in top"
                  name="show_in_top"
                  className="checkbox_withmargin"
                  checked={formData.show_in_top}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      show_in_top: e.target.checked,
                    });
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={2} xs={12}>
              <Form.Group className="mb-3">
                <FormCheck
                  type="checkbox"
                  id="show_in_slider"
                  label="show in slider"
                  name="show_in_slider"
                  className="checkbox_withmargin"
                  checked={formData.show_in_slider}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      show_in_slider: e.target.checked,
                    });
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={2} xs={12}>
              <Form.Group className="mb-3">
                <FormCheck
                  type="checkbox"
                  id="is_comm_soon"
                  label="comming soon"
                  name="is_comm_soon"
                  className="checkbox_withmargin"
                  checked={formData.is_comm_soon}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      is_comm_soon: e.target.checked,
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
                  <Button className="darkBlue-Btn FullWidthBtn" type="submit">
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
          {/* <Row>
            <Col xs={12} md={{ span: 4, offset: 8 }}>
              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-30 darkBlue-Btn FullWidthBtn"
              >
                {!isUpdate ? (
                  <>
                    <FaPlus className="me-1" /> Add
                  </>
                ) : (
                  <>
                    <FaUpload className="me-1" /> Update
                  </>
                )}
              </Button>
            </Col>
          </Row> */}
        </Form>
      )}
      <hr />
      <div className="result_list">
        {" "}
        {TripsMain && TripsMain.length > 0 ? (
          <Table responsive>
            <thead>
              <tr className="main_row">
                <th>code</th>
                <th>default name</th>
                <th>duration</th>
                <th>pickup</th>
                <th>in top</th>
                <th>in slider</th>
                <th>Soon</th>
                <th>destination</th>
                <th>route</th>
                <th>
                  Category
                  {/* <InputGroup className="filterInput"> */}
                  {/* <Form.Label>Destination</Form.Label> */}
                  <Form.Control
                    as="select"
                    name="trip_type"
                    onChange={(e) => setSearchCategory(e.target.value)}
                    value={SearchCategory}
                    required
                    className="filterInput"
                  >
                    <option value="">filter...</option>
                    {TripCategories &&
                      TripCategories?.map((cat, index) => (
                        <option key={index} value={cat.id}>
                          {cat.type_name}
                        </option>
                      ))}
                  </Form.Control>
                  {/* <Button onClick={()=> setSearchCategory()}>
                    <FaSearch />
                  </Button> */}
                  {/* </InputGroup> */}
                </th>
                <th>Release Days</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {TripsMain.filter(
                (item) =>
                  item.trip_default_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) &&
                  item.trip_type
                    ?.toString()
                    .includes(SearchCategory?.toString())
              ).map((trip, index) => (
                <tr
                  key={index}
                  className={trip.active ? "active-row" : "inactive-row"}
                >
                  {/* <td>
                    {" "}
                    <Form.Group className="mb-3" controlId="packageName">
                      <FormCheck
                        type="checkbox"
                        id="isChecked"
                        label=""
                        name="isChecked"
                        checked={isChecked}
                        onChange={(e) => {
                          setActiveTrip(trip);
                          setIsChecked(e.target.checked);
                        }}
                      />
                    </Form.Group>
                  </td> */}
                  <td>{trip.trip_code}</td>
                  <td>{trip.trip_default_name}</td>
                  <td>{trip.trip_duration}</td>
                  <td>{trip.pickup}</td>
                  <td>
                    {trip.show_in_top ? (
                      <FaCheck className="check_icon" />
                    ) : (
                      <FaTimes className="x_icon" />
                    )}
                  </td>
                  <td>
                    {trip.show_in_slider ? (
                      <FaCheck className="check_icon" />
                    ) : (
                      <FaX className="x_icon" />
                    )}
                  </td>
                  <td>
                    {trip.is_comm_soon ? (
                      <FaCheck className="check_icon" />
                    ) : (
                      <FaX className="x_icon" />
                    )}
                  </td>
                  <td>{trip.dest_default_name}</td>
                  <td>{trip.route}</td>
                  <td>
                    {
                      TripCategories.filter((f) => f.id == trip.trip_type)[0]
                        ?.type_name
                    }
                  </td>
                  <td>{trip.release_days}</td>
                  <td>{trip.trip_order}</td>
                  {/* {trip.trip_type == 2 ? (
                    <td>
                      {
                        TransferCategories.filter(
                          (f) => f.id == trip.transfer_category_id
                        )[0]?.category_name
                      }
                    </td>
                  ) : null} */}
                  <td>
                    {" "}
                    {trip.active && (
                      <button
                        className="btn btn-sm action_btn yellow-btn"
                        onClick={() => handleEdit(trip)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    )}
                    {trip.active ? (
                      <button
                        className="btn btn-sm red-btn action_btn"
                        onClick={() => handleDelete(trip, true)}
                        title="Disactive"
                      >
                        {/* <FaTrash /> */}
                        <FaEyeSlash />
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm red-btn action_btn"
                        onClick={() => handleDelete(trip, false)}
                        title="active"
                      >
                        <FaUndo />
                      </button>
                    )}
                    {/* <button
                      className="btn btn-sm  ms-2 purble-btn action_btn"
                      // onClick={() => handleAddImage(dest)}
                      title="Add Image"
                    >
                      <FaImage />
                    </button>
                    <button
                      className="btn btn-sm action_btn dark-purble-btn"
                      //onClick={() => handleAddTranslation(dest)}
                      title="Price"
                    >
                      <FaDollarSign />
                    </button> */}
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
      </div>
      {loading ? <LoadingPage /> : null}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
    </section>
  );
}

export default TripComp;
