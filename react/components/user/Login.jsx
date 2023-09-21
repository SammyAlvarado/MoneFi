import React, { useState, Fragment } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { mdiFacebook, mdiTwitter, mdiEmail } from "@mdi/js";
import { Link } from "react-router-dom";
import { Image, Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import loginSchema from "../../schemas/loginSchema";

import * as usersService from "../../services/userService";

import logger from "sabio-debug";
import swal from "sweetalert2";
import Icon from "@mdi/react";
import DotPattern from "assets/images/pattern/dots-pattern.svg";
import "./users.css";

Login.propTypes = {
  isLoggedIn: PropTypes.bool,
  loginSuccess: PropTypes.func,
};

function Login(props) {
  const navigate = useNavigate();

  const _logger = logger.extend("App");
  _logger("props", props);

  const { state } = useLocation();

  const [user] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (values) => {
    _logger("handleSubmit", values);

    usersService.login(values).then(loginSuccess).catch(loginError);
  };

  const loginError = (err) => {
    _logger("loginError:", err);
    let errMessage = err;
    if (err.message) {
      if (err.message === "Request failed with status code 404") {
        errMessage =
          "The requested user either has not been verified, or does not exists with the provided email and password combination.";
      } else {
        errMessage =
          "A login error occurred. Please contact technical support at: \n- Email: support@geeksui.com\n- Phone: (000) 123 456 789";
      }
    }
    swal.fire({
      closeOnCancel: true,
      backdrop: false,
      heightAuto: false,
      title: "Login failed!",
      text: errMessage,
      icon: "error",
    });
  };

  const loginSuccess = (response) => {
    _logger(response);

    usersService.getCurrent().then(getSuccess).catch(getFail);
  };

  const getFail = (err) => {
    _logger("Get Current User Fail:" + err);
    let errMessage = err;
    if (err.message) {
      if (err.message === "Request failed with status code 404") {
        errMessage = "No user exists with the email and password combination.";
      } else {
        errMessage =
          "A login error occurred. Please contact technical support at: \n- Email: support@geeksui.com\n- Phone: (000) 123 456 789";
      }
    }
    swal.fire({
      closeOnCancel: true,
      backdrop: false,
      heightAuto: false,
      title: "Login failed!",
      text: errMessage,
      icon: "error",
    });
  };

  const getSuccess = (response) => {
    _logger("Get Current User Success:" + response);
    const currentUser = {
      ...response.item,
    };
    currentUser.isLoggedIn = true;

    if (currentUser && currentUser.isLoggedIn) {
      if (state !== null && state.type && state.type !== null) {
        //if type was passed in state, redirect to that page after login
        navigate(state.type, { state: { currentUser } });
      } else if (currentUser.roles.includes("Admin")) {
        navigate("/dashboard/analytics/admin", { state: { currentUser } });
      } else if (currentUser.roles.includes("Merchant")) {
        navigate("/dashboard/merchant", { state: { currentUser } });
      } else if (currentUser.roles.includes("Borrower")) {
        navigate("/dashboard/borrower", { state: { currentUser } });
      } else {
        navigate("/", { state: { currentUser } });
      }
    }
  };

  return (
    <Fragment>
      <div className="">
        <Formik
          enableReinitialize={true}
          initialValues={user}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Container className="px-10">
              <Row className="justify-content-center pb-20">
                <Col xl={{ span: 3, offset: 0 }} lg={6} md={12}>
                  <Form className="mt-8 start-50 translate-middle-x">
                    <Card className="login-card-width">
                      <Card.Body className="p-6">
                        <div className="mb-4">
                          <h1 className="mb-4 lh-1 fw-bold h2">Log In With</h1>
                          <div className="mt-3 mb-5 d-grid d-md-block">
                            <div
                              className="btn-group mb-2 me-2 mb-md-0"
                              role="group"
                              aria-label="socialButton"
                            >
                              <button
                                type="button"
                                className="btn btn-outline-white shadow-sm"
                              >
                                <Icon
                                  path={mdiEmail}
                                  size={0.7}
                                  className="text-danger"
                                />{" "}
                                Google
                              </button>
                            </div>
                            <div
                              className="btn-group mb-2 me-2 mb-md-0"
                              role="group"
                              aria-label="socialButton"
                            >
                              <button
                                type="button"
                                className="btn btn-outline-white shadow-sm"
                              >
                                <Icon
                                  path={mdiTwitter}
                                  size={0.7}
                                  className="text-info"
                                />{" "}
                                Twitter
                              </button>
                            </div>
                            <div
                              className="btn-group mb-2 me-2 mb-md-0"
                              role="group"
                              aria-label="socialButton"
                            >
                              <button
                                type="button"
                                className="btn btn-outline-white shadow-sm"
                              >
                                <Icon
                                  path={mdiFacebook}
                                  size={0.7}
                                  className="text-primary"
                                />{" "}
                                Facebook
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="border-bottom"></div>
                          <div className="text-center mt-n2  lh-1">
                            <span className="bg-white px-2 fs-6">Or</span>
                          </div>
                        </div>
                        <div>
                          <div className="mb-3">
                            <Field
                              value={values.email}
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              placeholder="Enter email"
                            ></Field>
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-danger"
                            ></ErrorMessage>
                          </div>
                          <div className="mb-3">
                            <Field
                              value={values.password}
                              type="password"
                              className="form-control"
                              name="password"
                              id="password"
                              placeholder="Enter password"
                            ></Field>
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="text-danger"
                            ></ErrorMessage>
                          </div>
                          <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                              Continue
                            </button>
                          </div>
                        </div>
                      </Card.Body>
                      <Card.Footer className="bg-white px-6 py-4">
                        <ul>
                          <li>
                            Click{" "}
                            <Link
                              to="/register"
                              className="text-inherit fw-semi-bold"
                            >
                              here
                            </Link>{" "}
                            to create a new account.
                          </li>
                          <li>
                            Click{" "}
                            <Link
                              to="/resetpassword"
                              className="text-inherit fw-semi-bold"
                            >
                              here
                            </Link>{" "}
                            to recover your password.
                          </li>
                          <li>MoneFi will never share your email.</li>
                          <li>
                            By continuing you accept the{" "}
                            <Link to="#" className="text-inherit fw-semi-bold">
                              Terms of Use
                            </Link>
                            ,
                            <Link to="#" className="text-inherit fw-semi-bold">
                              {" "}
                              Privacy Policy
                            </Link>
                            , and{" "}
                            <Link to="#" className="text-inherit fw-semi-bold">
                              Data Policy
                            </Link>
                          </li>
                        </ul>
                      </Card.Footer>
                      <div className="position-relative div-dotted-background">
                        <div className="position-absolute bottom-0 end-0 me-md-n3 mb-md-n6 me-lg-n4 mb-lg-n4 me-xl-n6 mb-xl-n8 d-none d-md-block ">
                          <Image src={DotPattern} alt="" />
                        </div>
                      </div>
                    </Card>
                  </Form>
                </Col>
              </Row>
            </Container>
          )}
        </Formik>
      </div>
    </Fragment>
  );
}
export default Login;
