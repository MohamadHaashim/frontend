import React, {lazy} from 'react';
import {Route, Switch, useLocation} from 'react-router-dom';
import MinimalLayout from '../layout/MinimalLayout';
import NavMotion from '../layout/NavMotion';


// const AuthLogin = lazy(() => import('../views/pages/authentication/login'));
const AuthLogin3 = lazy(() => import('../views/pages/authentication/authentication3/Login3'));

const LoginRoutes = () => {
    const location = useLocation();

    return (
        <Route path={['/login']}>
            <MinimalLayout>
                <Switch location={location} key={location.pathname}>
                    <NavMotion>

                            <Route path="/login" component={AuthLogin3} />

                    </NavMotion>
                </Switch>
            </MinimalLayout>
        </Route>
    );
};

export default LoginRoutes;
