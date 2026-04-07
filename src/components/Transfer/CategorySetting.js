import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  GetTransfer_Categories,
  SaveTransferCategory,
} from "../../slices/tripSlice";
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
} from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import PopUp from "../Shared/popup/PopUp";
import LoadingPage from "../Loader/LoadingPage";
import CurrencySelect from "../Shared/MainSetting/CurrencySelect";
function CategorySetting() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    category_code: "",
    min_price: 0,
    max_price: 0,
    currency_code: "",
    min_capacity: 0,
    max_capacity: 0,
    category_name: "",
    delete: false,
    child_price: 0,
    notes: "",
  });
  const { loading, error, TransferCategories } = useSelector(
    (state) => state.trips
  );
  useEffect(() => {
    dispatch(GetTransfer_Categories());
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
      category_code: "",
      min_price: 0,
      max_price: 0,
      currency_code: "",
      min_capacity: 0,
      max_capacity: 0,
      category_name: "",
      delete: false,
      child_price: 0,
      notes: "",
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(SaveTransferCategory(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        setFormData({
          id: 0,
          category_code: "",
          min_price: 0,
          max_price: 0,
          currency_code: "",
          min_capacity: 0,
          max_capacity: 0,
          category_name: "",
          delete: false,
          child_price: 0,
          notes: "",
        });
        setIsUpdate(false);
        dispatch(GetTransfer_Categories());
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  const handleEdit = (transfer) => {
    setIsUpdate(true);
    setFilterExpanded(true);
    setFormData({
      id: transfer.id,
      category_code: transfer.category_code,
      min_price: transfer.min_price,
      max_price: transfer.max_price,
      currency_code: transfer.currency_code,
      min_capacity: transfer.min_capacity,
      max_capacity: transfer.max_capacity,
      category_name: transfer.category_name,
      delete: false,
      child_price: transfer.child_price,
      notes: transfer.notes,
    });
  };
  const handleDelete = (transfer) => {
    const data = {
      id: transfer.id,
      category_code: transfer.category_code,
      min_price: transfer.min_price,
      max_price: transfer.max_price,
      currency_code: transfer.currency_code,
      min_capacity: transfer.min_capacity,
      max_capacity: transfer.max_capacity,
      category_name: transfer.category_name,
      delete: true,
      child_price: transfer.child_price,
      notes: transfer.notes,
    };
    dispatch(SaveTransferCategory(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);

        dispatch(GetTransfer_Categories());
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  return (
    <section className="layout_section">
      <div className="d-flex justify-content-between align-items-center header_title">
        <h2 className="mb-4 page-title">Transfer Category Setting</h2>
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
            placeholder="Search transfer category..."
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
            <Col md={6}>
              {" "}
              <Form.Group className="mb-3">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="category code"
                  name="category_code"
                  value={formData.category_code}
                  onChange={handleInputChange}
                  required
                  className="formInput"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              {" "}
              <Form.Group className="mb-3">
                <Form.Label>Default Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="category name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  required
                  className="formInput"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Min Capacity</Form.Label>
                <Form.Control
                  type="number"
                  className="form-control"
                  placeholder="Min Capacity"
                  value={formData.min_capacity}
                  name="min_capacity"
                  onChange={handleInputChange}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Max Capacity</Form.Label>
                <Form.Control
                  type="number"
                  className="form-control"
                  placeholder="Max Capacity"
                  value={formData.max_capacity}
                  name="max_capacity"
                  onChange={handleInputChange}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  className="form-control"
                  placeholder="Min Price"
                  value={formData.min_price}
                  name="min_price"
                  onChange={handleInputChange}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                  type="number"
                  className="form-control"
                  placeholder="Max Price"
                  value={formData.max_price}
                  name="max_price"
                  onChange={handleInputChange}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="curr_code">
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
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Child Price</Form.Label>
                <Form.Control
                  type="number"
                  className="form-control"
                  placeholder="Enter price"
                  value={formData.child_price}
                  name="child_price"
                  onChange={handleInputChange}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="formInput"
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
        </Form>
      )}
      <div className="result_list">
        {" "}
        <Table responsive>
          <thead>
            <tr className="main_row">
              <th>code</th>
              <th>default name</th>
              <th>min capacity</th>
              <th>max_capacity</th>
              <th>min price</th>
              <th>max price</th>
              <th>Currency</th>
              <th>Child Price</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {TransferCategories &&
              TransferCategories.filter((item) =>
                item.category_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ).map((transfer, index) => (
                <tr key={index}>
                  <td>{transfer.category_code}</td>
                  <td>{transfer.category_name}</td>
                  <td>{transfer.min_capacity}</td>
                  <td>{transfer.max_capacity}</td>
                  <td>{transfer.min_price}</td>
                  <td>{transfer.max_price}</td>
                  <td>{transfer.currency_code}</td>
                  <td>{transfer.child_price}</td>
                  <td>{transfer.notes}</td>
                  <td>
                    {" "}
                    <button
                      className="btn btn-sm action_btn yellow-btn"
                      onClick={() => handleEdit(transfer)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm red-btn action_btn"
                      onClick={() => handleDelete(transfer)}
                      title="delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
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
    </section>
  );
}

export default CategorySetting;
