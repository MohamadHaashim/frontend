import React from "react";
import LogoLight2x from "../../images/logo2x.png";
import LogoDark2x from "../../images/logo-dark2x.png";
import LogoDark2xE from "../../images/logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      <img className="logo-light logo-img" src={LogoDark2xE} alt="logo" />
      <img className="logo-dark logo-img" src={LogoDark2xE} alt="logo" />
      <img className="logo-darkE logo-img" src={LogoDark2xE} alt="logo" />
    </Link>
  );
};

export default Logo;
