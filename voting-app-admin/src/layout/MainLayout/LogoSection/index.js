import React from 'react';
import {Link} from '@material-ui/core';
import {Link as RouterLink} from 'react-router-dom';

import config from './../../../config';

// import logo from './../../../assets/images/logo.svg';
import logo from './../../../assets/images/images/edison-logo.png'

const LogoSection = () => {

    return (
        <React.Fragment>
            {/* <Link component={RouterLink} to={config.defaultPath}> */}
                <img src={logo} alt="Berry" width="100" height={50}/>
            {/* </Link> */}
        </React.Fragment>
    );
};

export default LogoSection;
