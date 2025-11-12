import React from 'react'
import Navlogo from "../../../assets/img/bizconvo-logo.png"
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import '../../Footer/index.css';

function DefaultFooter() {
    return (
        <footer className="footer py-5">
            <div className="container">
                <div className="row">
                <div className="col-6 mx-auto text-center">
                        <p className="mb-0 text-secondary">
                            Copyright © {new Date().getFullYear()} All rights reserved bizconvo.com
                        </p>
                    </div>
                    <div className="col-lg-6 text-end">
                        <Link to={"#"} target="_blank" className="text-secondary px-2">
                            Privacy Policy
                        </Link>
                        <Link to={"#"} target="_blank" className="text-secondary ">
                            Terms & Conditions
                        </Link>

                    </div>
                    
                </div>
            </div>
        </footer>
    )
}

export default DefaultFooter;