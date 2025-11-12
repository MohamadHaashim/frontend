import React from 'react';
import './index.css';
interface Props {
  children: React.ReactNode
}
const DefaultLayout: React.FunctionComponent<Props> = (props:Props) => {
    return (
      <div>
        <div className="default-inner">
          <main>{props.children}</main>
        </div>
      </div>
    );
}
export default DefaultLayout;