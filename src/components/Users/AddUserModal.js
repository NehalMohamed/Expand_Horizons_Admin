import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { CreateUserByAdmin, fetchRoles } from "../../slices/usersSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";

function AddUserModal({ show, onHide, refreshUsers }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validated, setvalidated] = useState(false);
  const [errorsLst, seterrorsLst] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setformData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    ConfirmPassword: "",
    Role: "",
  });
  const { loading, error, User, Roles } = useSelector((state) => state.users);

  // useEffect(() => {
  //   dispatch(fetchRoles());
  //   return () => {};
  // }, []);

  //validate form inputs
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
  const signin = (event) => {
    event.preventDefault();
    // validation
    if (validate()) {
      formData["lang"] = "en";
      dispatch(CreateUserByAdmin(formData)).then((result) => {
        if (result.payload && result.payload.isSuccessed) {
          setShowAlert(false);
          setformData({
            FirstName: "",
            LastName: "",
            email: "",
            password: "",
            ConfirmPassword: "",
            Role: "",
          });
          onHide();
          refreshUsers();
        } else {
          setShowAlert(true);
        }
      });
    }
  };
  const closeAlert = () => {
    setShowAlert(false);
  };
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
      <Modal.Header closeButton>
        <Modal.Title className="page-title">Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={signin} noValidate>
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
                  <Form.Text type="invalid" className="errorTxt">
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
                  <Form.Text type="invalid" className="errorTxt">
                    {errorsLst.lastname}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} md={6} className="mb-2 mb-md-0">
              <Form.Group className="mb-3">
                <Form.Label className="formLabel">email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email"
                  required
                  name="email"
                  className="formInput"
                  onChange={fillFormData}
                />
                {errorsLst.email && (
                  <Form.Text type="invalid" className="errorTxt">
                    {errorsLst.email}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col xs={12} md={6} className="mb-2 mb-md-0">
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
                    Roles?.map((role, index) => (
                      <option key={index} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="formLabel">password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="password"
                  required
                  name="password"
                  className="formInput"
                  minLength={6}
                  onChange={fillFormData}
                />
                {errorsLst.password && (
                  <Form.Text type="invalid" className="errorTxt">
                    {errorsLst.password}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col lg={6} md={12} sm={12} xs={12}>
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
          <Button type="submit" className="frmBtn purbleBtn FullWidthBtn">
            Add User
          </Button>
          {loading ? <LoadingPage /> : null}
          {showAlert ? (
            <PopUp
              msg={User != null ? User.message : "Error"}
              closeAlert={closeAlert}
            />
          ) : null}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddUserModal;
