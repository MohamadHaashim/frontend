import React from 'react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { gridSpacing } from '../../store/constant';
import CategoryCard from '../../ui-component/cards/CategoryCard';
import Eventcard from '../../ui-component/cards/EventCard';
import NomineeCard from '../../ui-component/cards/NomineeCard';
import NomineesShowYearCard from '../../ui-component/cards/NomineesShowYearCard';
import ChartCard from '../../ui-component/cards/ChartCard';
import PopularCard from '../../ui-component/cards/PopularCard';
import VotingCard from '../../ui-component/cards/VotingCard';
import VotingLimitCard from '../../ui-component/cards/VotingLimitCard';

const Dashboard = () => {
    const navigate = useHistory();

    const handleNavigation = (path) => {
        navigate.push(path);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                        <div onClick={() => handleNavigation('/events')} style={{ cursor: 'pointer' }}>
                            <Eventcard/>
                        </div>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <div onClick={() => handleNavigation('/category')} style={{ cursor: 'pointer' }}>
                            <CategoryCard />
                        </div>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                    <div onClick={() => handleNavigation('/nominees')} style={{ cursor: 'pointer' }}>
                            <NomineeCard />
                        </div>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                    <div onClick={() => handleNavigation('/votings')} style={{ cursor: 'pointer' }}>
                            <VotingCard />
                        </div>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                    <div onClick={() => handleNavigation('/settings')} style={{ cursor: 'pointer' }}>
                            <VotingLimitCard />
                        </div>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                            <div onClick={() => handleNavigation('/settings')} style={{ cursor: 'pointer' }}>
                            <NomineesShowYearCard />
                        </div>
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                {/* <TotalIncomeCard /> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={12} md={8}>
                        {/* <ChartCard /> */}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        {/* <PopularCard /> */}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
