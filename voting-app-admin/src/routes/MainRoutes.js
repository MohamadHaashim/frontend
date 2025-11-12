import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import MainLayout from './../layout/MainLayout';


const DashboardDefault = lazy(() => import('../views/dashboard/Default'));

const TableBasic = lazy(() => import('../views/forms/tables/TableBasic'));
const TableDense = lazy(() => import('../views/forms/tables/TableDense'));

const UtilsTypography = lazy(() => import('../views/utilities/typography'));
const UtilsColor = lazy(() => import('../views/utilities/color'));
const UtilsShadow = lazy(() => import('../views/utilities/shadow'));
const UtilsMaterialIcons = lazy(() => import('../views/utilities/icons/MaterialIcons'));
const UtilsTablerIcons = lazy(() => import('../views/utilities/icons/TablerIcons'));

const EventPage = lazy(() => import('../views/events/index'));
const CategoyPage = lazy(() => import('../views/category/index'));
const NomineePage = lazy(() => import('../views/nominees/index'));
const VotingPage = lazy(() => import('../views/votings/index'));
const SettingsPage = lazy(() => import('../views/settings/index'))

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard',

                // '/tables/tbl-basic',
                // '/tables/tbl-dense',

                // '/utils/util-typography',
                // '/utils/util-color',
                // '/utils/util-shadow',
                // '/icons/tabler-icons',
                // '/icons/material-icons',
                '/events',
                '/category',
                '/nominees',
                '/votings',
                '/settings'
            ]}
        >
            <MainLayout showBreadcrumb={true}>
                <Switch location={location} key={location.pathname}>
                    <Route path="/dashboard" component={DashboardDefault} />

                    <Route path="/events" component={EventPage} />
                    <Route path="/category" component={CategoyPage} />
                    <Route path="/nominees" component={NomineePage} />
                    <Route path="/votings" component={VotingPage} />
                    <Route path="/settings" component={SettingsPage} />
                    
                    <Route path="/tables/tbl-basic" component={TableBasic} />
                    <Route path="/tables/tbl-dense" component={TableDense} />

                    <Route path="/utils/util-typography" component={UtilsTypography} />
                    <Route path="/utils/util-color" component={UtilsColor} />
                    <Route path="/utils/util-shadow" component={UtilsShadow} />
                    <Route path="/icons/tabler-icons" component={UtilsTablerIcons} />
                    <Route path="/icons/material-icons" component={UtilsMaterialIcons} />

                    

                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
