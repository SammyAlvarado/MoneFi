import React from "react";
import { Row, Card, Image, Col, Button } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import changePasswordSchema from "schemas/changePasswordSchema";
import debug from "sabio-debug";

import swal from "sweetalert2";
import DotPattern from "assets/images/pattern/dots-pattern.svg";
import MonefiLogo from "assets/images/brand/logo/MoneFiLogo.jpg";
import "./users.css";

import * as authenticationService from "../../services/authenticationService";

const _logger = debug.extend("ChangePassword");

const ChangePassword = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const token = queryParameters.get("token");
  const navigate = useNavigate();

  const state = {
    formData: {
      password: "",
      confirmPassword: "",
      token: token,
    },
  };

  const handleSubmit = (values) => {
    // console.log(values);
    _logger("Handle Submit", values);
    authenticationService
      .updatePasswordRequest(values)
      .then(onSubmitChangePasswordRequestSuccess)
      .catch(onSubmitChangePasswordRequestError);
  };

  var onSubmitChangePasswordRequestSuccess = (reponse) => {
    let message = reponse;

    _logger("Handle reponse", message);

    swal.fire({
      closeOnCancel: true,
      backdrop: false,
      heightAuto: false,
      title: "Passsword Successfully Changed",
      text: `Now try loggin in with your new password.`,
      icon: "success",
    });

    navigate("/login");
  };
  var onSubmitChangePasswordRequestError = (error) => {
    let errMessage = error;
    if (error.message) {
      if (error.message === "Request failed with status code 404") {
        errMessage = "Error 404: The request could not be completed";
      } else {
        errMessage = "Request invaild please try resubmiting Reset Password.";
      }
    }
    swal.fire({
      closeOnCancel: true,
      backdrop: false,
      heightAuto: false,
      title: "Password could not be changed",
      text: errMessage,
      icon: "error",
    });
  };

  return (
    <React.Fragment>
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col lg={5} md={5} className="py-8 py-xl-0">
          <Card>
            <Card.Body className="p-6">
              <Row>
                <div className="mb-4">
                  <Formik
                    enableReinitialize={true}
                    initialValues={state.formData}
                    onSubmit={handleSubmit}
                    validationSchema={changePasswordSchema}
                  >
                    {({ isValid, touched }) => (
                      <Form>
                        <div className="form-group">
                          <Col log={12} md={12} className="mb-3">
                            <Link to="/">
                              <Image src={MonefiLogo} alt="Home" width="150" />
                            </Link>
                          </Col>
                          <Col log={12} md={12} className="mb-3">
                            <h1>Create new password</h1>
                            <p>
                              Your new password must be different from previous
                              used password.
                            </p>
                          </Col>
                          <Col log={12} md={12} className="mb-3">
                            <label htmlFor="password">Password</label>
                            <Field
                              type="password"
                              name="password"
                              className="form-control"
                              placeholder="Enter new password"
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="text-danger"
                            />
                          </Col>
                          <Col log={12} md={12} className="mb-3">
                            <label htmlFor="confirmPassword">
                              Confirm Password
                            </label>
                            <Field
                              type="password"
                              name="confirmPassword"
                              className="form-control"
                              placeholder="Enter new confirm password"
                            />
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="text-danger"
                            />
                          </Col>
                          <Col log={12} md={12} className="mb-3 d-grid gap-2">
                            <Button
                              type="submit"
                              className="btn btn-primary"
                              disabled={
                                !isValid ||
                                !touched.password ||
                                !touched.confirmPassword
                              }
                            >
                              Submit
                            </Button>
                          </Col>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Row>
            </Card.Body>
            <div className="position-relative div-dotted-background">
              <div className="position-absolute bottom-0 end-0 me-md-n3 mb-md-n6 me-lg-n4 mb-lg-n4 me-xl-n6 mb-xl-n8 d-none d-md-block ">
                <Image src={DotPattern} alt="Background Dot Pattern" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ChangePassword;
