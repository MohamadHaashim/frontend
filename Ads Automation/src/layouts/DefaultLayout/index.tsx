import React from 'react';
import Logo from "../../assets/brand/logo.svg";
import './index.css';
interface Props {
  children: React.ReactNode
}
const DefaultLayout: React.FunctionComponent<Props> = (props:Props) => {
    return (
      <div>
        <div className='header'>
          <div className="login-log">
            <img src={Logo} alt="logo" />
          </div>
        </div>
        <div className="default-inner">
          <main>{props.children}</main>
        </div>
      </div>
    );
}
export default DefaultLayout;