import React from 'react';
import './index.css';
import { Col, Row } from 'react-bootstrap';

class Footer extends React.Component
{
  render()
  {
    return (
      <footer>
        <div className="jumbotron text-center">
          <Row>
            <Col className='left'>© 2023, Ads Automation</Col>
            <Col className='right'>
              <ul>
                <li>Privacy Policy</li>
                <li>Documentation</li>
                <li>Support</li>
              </ul>
            </Col>
          </Row>
        </div>
      </footer>
    )
  }
}
export default Footer;
