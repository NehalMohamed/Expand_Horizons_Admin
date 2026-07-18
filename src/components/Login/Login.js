/**
 * Login Component
 *
 * Authenticates users into the administration panel.
 *
 * Features:
 * - Validate user credentials
 * - Authenticate using Redux
 * - Display validation errors
 * - Show loading indicator while signing in
 * - Display success or error messages
 * - Redirect to dashboard after successful login
 */
import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row, FloatingLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoginUser } from "../../slices/AuthSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import "./Login.scss";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Stores validation errors for form fields
  const [errorsLst, setErrorsLst] = useState({});

  // Indicates whether the form has been validated
  const [validated, setValidated] = useState(false);

  // Controls popup notification visibility
  const [showPopup, setShowPopup] = useState(false);

  // Login form model
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    ConfirmPassword: "",
    Role: "User",
    sendOffers: false,
  });
  // Authentication status from Redux store

  const { loading, success, message } = useSelector((state) => state.auth);
  /**
   * Validates login form inputs.
   *
   * Validation Rules:
   * - Email must be valid
   * - Password must contain at least 6 characters
   *
   * @returns {boolean} True if validation succeeds.
   */
  const validate = () => {
    // Validate email format.
    if (!/^\S+@\S+\.\S+$/.test(formData.email) || formData.email.trim() == "") {
      setErrorsLst({
        ...errorsLst,
        email: "Please enter a valid email address.",
      });
      return false;
    }
    // Validate password length.
    if (formData.password.trim() == "" || formData.password.length < 6) {
      setErrorsLst({
        ...errorsLst,
        password: "Password must be at least 6 characters long.",
      });
      return false;
    }

    return true;
  };

  /**
   * Authenticates the user.
   *
   * On success:
   * - Redirects to the dashboard.
   *
   * On failure:
   * - Displays an error popup.
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const signin = (event) => {
    event.preventDefault();
    // validation
    if (validate()) {
      let lang = "en";
      let data = {
        payload: {
          email: formData.email,
          password: formData.password,
          lang: lang,
        },
        path: "/LoginUser",
      };
      dispatch(LoginUser(data)).then((result) => {
        if (result.payload && result.payload.isSuccessed) {
          //if user register successfully so navigate to  verify email first
          setShowPopup(false);
          navigate("/dashboard");
        } else {
          setShowPopup(true);
        }
      });
    }
  };
  /**
   * Updates login form values.
   *
   * Also clears any previous validation errors.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const fillFormData = (e) => {
    setValidated(false);
    setErrorsLst({});
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };
  console.log("loading ", loading);
  return (
    <section className="centerSection">
      <div className="login_page">
        <div className="d-flex justify-content-center align-items-center logo-div">
          <img
            src="/logo.png"
            alt="expand horizons"
            className="logo-img"
            loading="lazy"
            decoding="async"
          />
        </div>
        {/* <div className="form_title">
          <h4 className="title">Log in</h4>
        </div> */}

        <p className="SubTitle">
          Check out more easily and access your tickets on any device with your{" "}
          <strong>Horizon-Admin</strong> account.
        </p>
        <Form onSubmit={signin} noValidate>
          <Row>
            <Col xs={12}>
              {" "}
              <FloatingLabel label="Email" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
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
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <FloatingLabel label="Password" className="mb-3">
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
                  <Form.Text type="invalid" className="errorTxt">
                    {errorsLst.password}
                  </Form.Text>
                )}
              </FloatingLabel>
            </Col>
          </Row>
          <Button type="submit" className="frmBtn secondryBtn FullWidthBtn">
            Sign In
          </Button>
        </Form>
        {loading == true ? <LoadingPage /> : null}
        {showPopup == true ? (
          <PopUp
            show={showPopup}
            closeAlert={() => setShowPopup(false)}
            msg={message}
            type={success ? "success" : "error"}
            autoClose={3000}
          />
        ) : null}
      </div>
    </section>
  );
}

export default Login;
