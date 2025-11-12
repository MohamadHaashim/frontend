import React from 'react';
import './index.css';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer pt-3  ">
      <div className="container-fluid">
        <div className="row align-items-center justify-content-lg-between">
          <div className="col-lg-6 mb-lg-0 mb-4">
            <div className="copyright text-center text-muted text-lg-start">
              © {new Date().getFullYear()}, <Link to={"/vendor/dashboard"}>Bizconvo</Link> All rights reserved.
            </div>
          </div>
          <div className="col-lg-6">
            <ul className="nav nav-footer justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <a href="" className="nav-link pe-0 text-muted">Privacy Policy</a>
              </li>
              <li className="nav-item">
                <a href="" className="nav-link pe-0 text-muted">Terms & Conditions</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer;
