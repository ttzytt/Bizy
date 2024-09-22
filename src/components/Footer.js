
import React from "react";
import moment from "moment-timezone";
import { Row, Col, Card, OverlayTrigger, Tooltip, Image, Button } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faDownload, faRocket } from "@fortawesome/free-solid-svg-icons";
import BS5Logo from "../assets/img/technologies/bootstrap-5-logo.svg";
import ReactLogo from "../assets/img/technologies/react-logo.svg";
import LaravelLogo from "../assets/img/technologies/laravel-logo.svg";
import GitHubButton from 'react-github-btn';
import { Link } from 'react-router-dom';
import { Routes } from "../routes";

export default (props) => {
  const currentYear = moment().get("year");
  const showSettings = props.showSettings;

  const toggleSettings = (toggle) => {
    props.toggleSettings(toggle);
  }

  return (
    <div>
      {showSettings ? (
        <Card.Link className="settings-button" onClick={() => toggleSettings(false)}>
          <FontAwesomeIcon icon={faCogs} />
        </Card.Link>
      ) : null}
      <footer className="footer section py-5">
        <Row>
          <Col xs={12} className="text-center">
            <p className="mb-0">
              &copy; {currentYear} <Card.Link as={Link} to={Routes.Presentation.path} className="text-blue text-decoration-none fw-normal">
                Bizy
              </Card.Link>
            </p>
          </Col>
        </Row>
      </footer>
    </div>
  );
};
