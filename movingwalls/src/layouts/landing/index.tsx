import React from 'react';
import './index.css';
interface Props {
  children: React.ReactNode
}
const LandingLayout: React.FunctionComponent<Props> = (props:Props) => {
    return (
      <div className='landing-page-container'>
        <div className="default-inner">
          <main>{props.children}</main>
        </div>
      </div>
    );
}
export default LandingLayout;