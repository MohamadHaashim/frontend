import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AuthRoute({authorized}) {

  if(!authorized){
    return <Redirect to="/SuperAdmin" />
  }
  return (
    <div>
      <h3>ruehfioerhfioerf</h3>
    </div>
  );
}

export default AuthRoute;