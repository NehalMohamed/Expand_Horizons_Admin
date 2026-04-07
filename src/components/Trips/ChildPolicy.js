import React, { useEffect, useState } from "react";
import {
  GetTrip_ChildPolicy,
  SaveTripChildPolicy,
} from "../../slices/tripSlice";
import { Form, Row, Col, Button, Table, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import { FaEdit, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import CurrencySelect from "../Shared/MainSetting/CurrencySelect";

const priceTypes = [
  { id: 1, name: "Free" },
  { id: 2, name: "% of Adult Price" },
  { id: 3, name: "Fixed Amount" },
];
function ChildPolicy({
  trip_id,
  show,
  setShow,
  setPopupMessage,
  setPopupType,
  setShowPopup,
}) {
  const dispatch = useDispatch();
  //   const [trip_id, setTrip_id] = useState(0);
  const [isUpdate, setIsUpdate] = useState(0);
  const [formData, setFormData] = useState({
    policy_id: 0,
    trip_id: trip_id,
    code_auto: "",
    age_from: 0,
    currency_code: "",
    delete: false,
    age_to: 0,
    notes: "",
    pricing_type: 0,
    child_price: 0,
  });
  const { loading, error, ChildPolicyList } = useSelector(
    (state) => state.trips
  );
  useEffect(() => {
    dispatch(GetTrip_ChildPolicy(trip_id));
    return () => {};
  }, [trip_id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteClick = (price) => {
    let data = {
      policy_id: price.policy_id,
      trip_id: trip_id,
      code_auto: price.code_auto,
      age_from: price.age_from,
      currency_code: price.currency_code,
      delete: true,
      age_to: price.age_to,
      notes: price.notes,
      pricing_type: price.pricing_type,
      child_price: price.child_price,
    };
    dispatch(SaveTripChildPolicy(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        dispatch(GetTrip_ChildPolicy(trip_id));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };
  const AddPolicy = (e) => {
    e.preventDefault();
    formData["trip_id"] = trip_id;
    dispatch(SaveTripChildPolicy(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        dispatch(GetTrip_ChildPolicy(trip_id));
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
      setIsUpdate(false);
      setFormData({
        policy_id: 0,
        trip_id: trip_id,
        code_auto: "",
        age_from: 0,
        currency_code: "",
        delete: false,
        age_to: 0,
        notes: "",
        pricing_type: 0,
        child_price: 0,
      });
    });
  };
  const resetForm = () => {
    setIsUpdate(false);
    setFormData({
      policy_id: 0,
      trip_id: trip_id,
      code_auto: "",
      age_from: 0,
      currency_code: "",
      delete: false,
      age_to: 0,
      notes: "",
      pricing_type: 0,
      child_price: 0,
    });
  };
  const handleEdit = (price) => {
    setIsUpdate(true);
    setFormData({
      policy_id: price.policy_id,
      trip_id: trip_id,
      code_auto: price.code_auto,
      age_from: price.age_from,
      currency_code: price.currency_code,
      delete: false,
      age_to: price.age_to,
      notes: price.notes,
      pricing_type: price.pricing_type,
      child_price: price.child_price,
    });
  };
  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Child Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={AddPolicy}>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Type</Form.Label>
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
            <Col md={3}>
              <Form.Group>
                <Form.Label>age from</Form.Label>
                <Form.Control
                  type="number"
                  className="form-control"
                  placeholder="age from"
                  value={formData.age_from}
                  name="age_from"
                  onChange={handleInputChange}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>age To</Form.Label>
                <Form.Control
                  type="number"
                  className="form-control"
                  placeholder="age to"
                  value={formData.age_to}
                  name="age_to"
                  onChange={handleInputChange}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
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
                  disabled={formData.pricing_type == 1}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Group controlId="curr_code">
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  as="select"
                  name="currency_code"
                  value={formData.currency_code}
                  onChange={handleInputChange}
                  required
                  disabled={formData.pricing_type == 1}
                >
                  <option value={""}>select Currency</option>
                  {/* {currencies.map((currency, index) => (
                    <option key={index} value={currency.code}>
                      {currency.code}
                    </option>
                  ))} */}
                  <CurrencySelect />
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
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
            {isUpdate ? (
              <>
                <Col xs={12} md={3}>
                  {" "}
                  <Button
                    className="darkBlue-Btn FullWidthBtn mt-4"
                    type="submit"
                  >
                    <FaUpload className="me-1" /> update
                  </Button>
                </Col>
                <Col xs={12} md={3}>
                  <Button
                    className="purble-btn FullWidthBtn mt-4"
                    onClick={resetForm}
                  >
                    <FiRefreshCcw className="me-1" /> Reset
                  </Button>
                </Col>
              </>
            ) : (
              <Col xs={12} md={{ span: 3, offset: 3 }}>
                <Button
                  className="darkBlue-Btn FullWidthBtn mt-4"
                  type="submit"
                >
                  <FaPlus className="me-1" /> Add
                </Button>
              </Col>
            )}
          </Row>
        </Form>
        <hr className="divider" />
        <div className="result_list">
          {" "}
          {ChildPolicyList && ChildPolicyList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr className="main_row">
                  <th>pricing type</th>
                  <th>age from</th>
                  <th>age to</th>
                  <th>Child price</th>
                  <th>currency code</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {ChildPolicyList.map((price, index) => (
                  <tr key={index}>
                    <td>
                      {price.pricing_type == 2
                        ? "%"
                        : price.pricing_type == 3
                        ? "Fixed"
                        : "Free"}
                    </td>
                    <td>{price.age_from}</td>
                    <td>{price.age_to}</td>
                    <td>{price.child_price}</td>
                    <td>{price.currency_code}</td>
                    <td>{price.notes}</td>
                    <td>
                      <div className="d-flex btn-lst">
                        <button
                          className="btn btn-sm action_btn yellow-btn"
                          onClick={() => handleEdit(price)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger action_btn"
                          onClick={() => handleDeleteClick(price)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
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
      </Modal.Body>
    </Modal>
  );
}

export default ChildPolicy;
