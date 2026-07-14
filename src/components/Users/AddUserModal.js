import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CreateUserByAdmin } from "../../slices/usersSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";

/**
 * AddUserModal Component
 *
 * Modal used by administrators to create new users.
 *
 * Features:
 * - Client-side form validation.
 * - Create new user via Redux.
 * - Display validation and server errors.
 * - Refresh user list after successful creation.
 */
function AddUserModal({ show, onHide, refreshUsers }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form validation state
  const [validated, setvalidated] = useState(false);

  // Stores validation messages for each field
  const [errorsLst, seterrorsLst] = useState({});

  // Controls error popup visibility
  const [showAlert, setShowAlert] = useState(false);

  // Form data sent to the API
  const [formData, setformData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    ConfirmPassword: "",
    Role: "",
  });

  // Redux state
  const { loading, error, User, Roles } = useSelector((state) => state.users);

  /**
   * Validate user input before submitting.
   *
   * Returns:
   * true  -> Validation passed.
   * false -> Validation failed.
   */
  const validate = () => {
    if (formData.FirstName == null || formData.FirstName.trim() == "") {
      seterrorsLst({
        ...errorsLst,
        firstname: "Please fill this field",
      });
      return false;
    }

    if (formData.LastName == null || formData.LastName.trim() == "") {
      seterrorsLst({
        ...errorsLst,
        lastname: "Please fill this field",
      });
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email) || formData.email.trim() == "") {
      seterrorsLst({
        ...errorsLst,
        email: "Please enter a valid email address.",
      });
      return false;
    }

    if (formData.password.trim() == "" || formData.password.length < 6) {
      seterrorsLst({
        ...errorsLst,
        password: "Password must be at least 6 characters long.",
      });
      return false;
    }

    if (formData.ConfirmPassword !== formData.password) {
      seterrorsLst({
        ...errorsLst,
        ConfirmPassword: "Password donnot match.",
      });
      return false;
    }

    return true;
  };

  /**
   * Handles form submission.
   *
   * Steps:
   * 1. Validate form.
   * 2. Add default language.
   * 3. Call CreateUser API.
   * 4. Reset form after success.
   * 5. Refresh user list.
   */
  const signin = (event) => {
    event.preventDefault();

    if (validate()) {
      formData["lang"] = "en";

      dispatch(CreateUserByAdmin(formData)).then((result) => {
        if (result.payload && result.payload.isSuccessed) {
          setShowAlert(false);

          // Reset form
          setformData({
            FirstName: "",
            LastName: "",
            email: "",
            password: "",
            ConfirmPassword: "",
            Role: "",
          });

          // Close modal
          onHide();

          // Reload users table
          refreshUsers();
        } else {
          setShowAlert(true);
        }
      });
    }
  };

  /**
   * Closes the popup message.
   */
  const closeAlert = () => {
    setShowAlert(false);
  };

  /**
   * Updates form state whenever
   * an input value changes.
   *
   * Also clears previous validation errors.
   */
  const fillFormData = (e) => {
    setvalidated(false);
    seterrorsLst({});

    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      {/* Modal Header */}
      <Modal.Header closeButton>
        <Modal.Title className="page-title">Add User</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={signin} noValidate>
          {/* User Name */}
          <Row className="mb-3">
            <Col lg={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="formLabel">First Name</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="First Name"
                  className="formInput"
                  required
                  name="FirstName"
                  onChange={fillFormData}
                />

                {errorsLst.firstname && (
                  <Form.Text className="errorTxt">
                    {errorsLst.firstname}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col lg={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="formLabel">Last Name</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  className="formInput"
                  required
                  name="LastName"
                  onChange={fillFormData}
                />

                {errorsLst.lastname && (
                  <Form.Text className="errorTxt">
                    {errorsLst.lastname}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Email & Role */}
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="formLabel">Email</Form.Label>

                <Form.Control
                  type="email"
                  placeholder="Email"
                  required
                  name="email"
                  className="formInput"
                  onChange={fillFormData}
                />

                {errorsLst.email && (
                  <Form.Text className="errorTxt">{errorsLst.email}</Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="service">
                <Form.Label className="formLabel">Role</Form.Label>

                <Form.Control
                  as="select"
                  name="Role"
                  onChange={fillFormData}
                  value={formData.Role}
                  required
                  className="form-select"
                >
                  <option value="">Select Role</option>

                  {Roles &&
                    Roles.map((role, index) => (
                      <option key={index} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Password */}
          <Row className="mb-3">
            <Col lg={6}>
              <Form.Group>
                <Form.Label className="formLabel">Password</Form.Label>

                <Form.Control
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  className="formInput"
                  minLength={6}
                  onChange={fillFormData}
                />

                {errorsLst.password && (
                  <Form.Text className="errorTxt">
                    {errorsLst.password}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col lg={6}>
              <Form.Group>
                <Form.Label className="formLabel">Confirm Password</Form.Label>

                <Form.Control
                  required
                  type="password"
                  placeholder="Confirm Password"
                  name="ConfirmPassword"
                  className="formInput"
                  minLength={6}
                  onChange={fillFormData}
                />

                {errorsLst.ConfirmPassword && (
                  <Form.Text className="errorTxt">
                    {errorsLst.ConfirmPassword}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Submit Button */}
          <Button type="submit" className="frmBtn purbleBtn FullWidthBtn">
            Add User
          </Button>

          {/* Loading Overlay */}
          {loading && <LoadingPage />}

          {/* Error Popup */}
          {showAlert && (
            <PopUp
              msg={User != null ? User.message : "Error"}
              closeAlert={closeAlert}
            />
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddUserModal;
