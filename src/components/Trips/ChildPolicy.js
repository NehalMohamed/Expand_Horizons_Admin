/**
 * -----------------------------------------------------------------------------
 * ChildPolicy Component
 * -----------------------------------------------------------------------------
 * Purpose:
 * Manages child pricing policies for a specific trip. This component allows
 * administrators to create, edit, delete, and view child age policies that
 * determine how children are priced during booking.
 *
 * Features:
 * - Retrieves all child policies for the selected trip.
 * - Adds new child pricing rules.
 * - Updates existing child policies.
 * - Deletes (soft deletes) child policies.
 * - Supports multiple pricing types:
 *      • Free
 *      • Percentage of Adult Price
 *      • Fixed Amount
 * - Supports currency selection for fixed-price policies.
 * - Displays all configured policies in a table with edit/delete actions.
 *
 * Props:
 * @param {number} trip_id - The ID of the selected trip.
 * @param {boolean} show - Controls modal visibility.
 * @param {Function} setShow - Opens/closes the modal.
 * @param {Function} setPopupMessage - Sets popup message text.
 * @param {Function} setPopupType - Sets popup type (success/error).
 * @param {Function} setShowPopup - Controls popup visibility.
 *
 * Redux:
 * - GetTrip_ChildPolicy()
 * - SaveTripChildPolicy()
 *
 
 * -----------------------------------------------------------------------------
 */
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

// Available child pricing types
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

  // Indicates whether the form is in Add or Update mode
  const [isUpdate, setIsUpdate] = useState(0);

  // Child policy form data
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

  // Get loading state and child policy list from Redux
  const { loading, error, ChildPolicyList } = useSelector(
    (state) => state.trips,
  );

  // Load child policies whenever the selected trip changes
  useEffect(() => {
    dispatch(GetTrip_ChildPolicy(trip_id));
  }, [trip_id]);

  // Update form values when user edits an input
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Delete (soft delete) a child policy
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

        // Reload updated child policy list
        dispatch(GetTrip_ChildPolicy(trip_id));
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };

  // Save a new child policy or update an existing one
  const AddPolicy = (e) => {
    e.preventDefault();

    formData["trip_id"] = trip_id;

    dispatch(SaveTripChildPolicy(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);

        // Refresh list after saving
        dispatch(GetTrip_ChildPolicy(trip_id));
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }

      // Reset form after save
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

  // Reset form back to Add mode
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

  // Load selected policy into the form for editing
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
        {/* Add / Edit Child Policy Form */}
        <Form onSubmit={AddPolicy}>
          <Row>
            {/* Pricing Type */}
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

            {/* Age From */}
            <Col md={3}>
              <Form.Group>
                <Form.Label>age from</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="age from"
                  value={formData.age_from}
                  name="age_from"
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Age To */}
            <Col md={3}>
              <Form.Group>
                <Form.Label>age To</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="age to"
                  value={formData.age_to}
                  name="age_to"
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            {/* Child Price */}
            <Col md={3}>
              <Form.Group>
                <Form.Label>Child Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={formData.child_price}
                  name="child_price"
                  onChange={handleInputChange}
                  required
                  disabled={formData.pricing_type == 1}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Currency */}
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
                  <CurrencySelect />
                </Form.Control>
              </Form.Group>
            </Col>

            {/* Notes */}
            <Col md={3}>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            {/* Show Update buttons or Add button */}
            {isUpdate ? (
              <>
                <Col xs={12} md={3}>
                  <Button
                    className="darkBlue-Btn FullWidthBtn mt-4"
                    type="submit"
                  >
                    <FaUpload className="me-1" /> Update
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

        {/* Existing Child Policies */}
        <div className="result_list">
          {ChildPolicyList && ChildPolicyList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr className="main_row">
                  <th>Pricing Type</th>
                  <th>Age From</th>
                  <th>Age To</th>
                  <th>Child Price</th>
                  <th>Currency</th>
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

                    {/* Edit/Delete Actions */}
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
            // Empty state
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
