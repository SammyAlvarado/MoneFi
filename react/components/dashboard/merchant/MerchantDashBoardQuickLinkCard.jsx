import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const MerchantDashBoardQuickLinkCard = (props) => {
  const { title, titleDescription, link, linkDescription } = props;

  return (
    <Card>
      <Card.Body>
        <Row>
          <Col>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{titleDescription}</Card.Text>
            <Link
              to={{
                pathname: `${link}`,
              }}
              className="btn btn-sm btn-primary"
            >
              {linkDescription}
            </Link>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

MerchantDashBoardQuickLinkCard.propTypes = {
  title: PropTypes.string.isRequired,
  titleDescription: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  linkDescription: PropTypes.string.isRequired,
};

export default MerchantDashBoardQuickLinkCard;
