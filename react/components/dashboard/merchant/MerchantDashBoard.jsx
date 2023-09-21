import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import MerchantQuickLinks from "./MerchantDashBoardQuickLinkCard";
import MerchantBlogCardPreview from "./MerchantBlogCardPreview";
import LoanAppListView from "components/loanapplications/LoanAppListView";
import blogsService from "../../../services/blogsService";
import dashboardService from "../../../services/dashboardService";
import PropTypes from "prop-types";
import toastr from "toastr";
import debug from "sabio-debug";
import "./merchant.css";

const _logger = debug.extend("MerchantDashBoard");

function MerchantDashBoard(props) {
  _logger("Props", props);

  const [dashboardData, setDashboardData] = useState({
    data: [],
    blogComponents: [],
    loanApplications: [],
    pageIndex: 0,
    pageSize: 3,
  });

  useEffect(() => {
    blogsService
      .getAll(dashboardData.pageIndex, dashboardData.pageSize)
      .then(blogsGetAllSuccess)
      .catch(blogsGetAllError);

    dashboardService
      .getDashboardData()
      .then(onGetDashboardDataSuccess)
      .catch(onGetDashboardDataError);
  }, []);

  const blogsGetAllSuccess = (response) => {
    let blogPagedItems = response.item.pagedItems;

    setDashboardData((prevState) => {
      let ps = { ...prevState };

      ps.blogComponents = blogPagedItems.map(mapABlog);
      ps.data = response.item.pagedItems;
      return ps;
    });
  };

  const blogsGetAllError = (err) => {
    _logger("BlogsGetAllError ->", err);
    toastr.error("Could not load blog data");
  };

  const onGetDashboardDataSuccess = (response) => {
    let data = response.data.item;
    _logger(data);
    _logger("users => ", data.users);
    setDashboardData((prevState) => {
      const newDashData = { ...prevState, ...data };
      return newDashData;
    });
  };

  const onGetDashboardDataError = (error) => {
    _logger("Get Dashboard Data error", error);
    toastr.error("Could not load loan data.");
  };

  const mapABlog = (aBlog) => {
    return (
      <div
        className="col-lg-4 col-md-6 col-sm-12 mb-4"
        key={`blogId-${aBlog.id}_authorId-${aBlog.authorId}`}
      >
        <MerchantBlogCardPreview blog={aBlog} currentUser={props.currentUser} />
      </div>
    );
  };

  return (
    <div>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 d-lg-flex justify-content-between align-items-center">
            <div className="mb-3 mb-lg-0">
              <h1 className="mb-0 h1 fw-bold">Dashboard</h1>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="border-bottom p-4 d-lg-flex justify-content-center">
        <div className="mb-3 mb-lg-0">
          <h3 className="mb-3 h2 fw-bold">Quick Links</h3>
        </div>
        <Col>
          <MerchantQuickLinks
            title="Schedule"
            titleDescription="Schedule an appointment."
            link="/appointments"
            linkDescription="Schedule Now"
          />
        </Col>
        <Col>
          <MerchantQuickLinks
            title="Appointments"
            titleDescription="View latest appointments"
            link="/appointments/client"
            linkDescription="View Appointments"
          />
        </Col>
        <Col>
          <MerchantQuickLinks
            title="Profile Setting"
            titleDescription="View profile setting."
            link="/settings"
            linkDescription="View Setting"
          />
        </Col>
      </Row>
      <Row className="border-bottom p-4 d-lg-flex justify-content-center">
        <Row className="mb-4">
          <LoanAppListView />
        </Row>
      </Row>
      <Row className="border-bottom p-4 d-lg-flex justify-content-right">
        <h3 className="mb-3 mb-lg-3 h2 fw-bold">Blogs</h3>
        <div className="row">{dashboardData.blogComponents}</div>
      </Row>
    </div>
  );
}

MerchantDashBoard.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default MerchantDashBoard;
