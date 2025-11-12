import React from 'react'
import Navlogo from "../../../assets/img/Yallilogo.png"
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function DefaultMenu() {
    return (
        <nav className="navbar navbar-expand-lg blur blur-rounded top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4">
            <div className="container-fluid pe-0">
                <a className="navbar-brand font-weight-bolder ms-lg-0 ms-3 " href="/dashboard">
                    <img className="logo" src={Navlogo} />
                </a>
                <button className="navbar-toggler shadow-none ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon mt-2">
                        <span className="navbar-toggler-bar bar1"></span>
                        <span className="navbar-toggler-bar bar2"></span>
                        <span className="navbar-toggler-bar bar3"></span>
                    </span>
                </button>
                <div className="collapse navbar-collapse" id="navigation">
                    <ul className="navbar-nav mx-auto ms-xl-auto me-xl-7">
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center me-2 active" aria-current="page" href="">
                                <i className="fa fa-chart-pie opacity-6 text-dark me-1"></i>
                                About Us
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link d-flex align-items-center me-2 active" href="">
                                <i className="fa fa-user opacity-6 text-dark me-1"></i>
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default DefaultMenu;