import React from 'react';
import './index.css';
import DefaultMenu from '../../shared/Default/Menu/defaultMenu';
interface Props {
  children: React.ReactNode
}
function DefaultLayout (props:Props){
    return (
      <>
        <div className="container position-sticky z-index-sticky top-0">
          <div className="row">
            <div className="col-12">
              <DefaultMenu />
            </div>
          </div>
        </div>
        <div className="default-inner">
          <main>{props.children}</main>
        </div>
      </>
    );
}
export default DefaultLayout;