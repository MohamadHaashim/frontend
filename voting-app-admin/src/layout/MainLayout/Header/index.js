import React from 'react';
import { Avatar, ButtonBase, Grid, Hidden, makeStyles } from '@material-ui/core';

import { IconMenu2 } from '@tabler/icons';

import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';

import Customization from './Customization';

import MobileSection from './MobileSection';

import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import Breadcrumbs from '../../../ui-component/extended/Breadcrumb';
import navigation from '../../../menu-items/main-menu-items';
import { IconChevronRight } from '@tabler/icons';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    headerAvtar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        transition: 'all .2s ease-in-out',
        background: theme.palette.primary.light,
        color: theme.palette.purple.dark,
        '&:hover': {
            background: theme.palette.purple.main,
            color: theme.palette.purple.light
        }
    },
    boxContainer: {
        width: '228px',
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            width: 'auto'
        }
    },
    breadcrumbWrapper: {
        // flexGrow: 2,
        height: 1,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        display: 'flex',
        // gap: 100,
        alignItems: 'center',
        paddingTop: 20, 
        // justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            display: 'none',
            // justifyContent: 'flex-start'
        }
    }
}));

const Header = (props, showBreadcrumb = true) => {
    const { handleLeftDrawerToggle } = props;
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.boxContainer}>
                <Hidden mdDown>
                    <LogoSection />
                    <div className={classes.grow} />
                </Hidden>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Avatar variant="rounded" className={classes.headerAvtar} onClick={handleLeftDrawerToggle}>
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </div>
            {/* <SearchSection theme="light" /> */}

            {showBreadcrumb && (
                // <Grid item sm>
                <div className={classes.breadcrumbWrapper}>
                    <Breadcrumbs
                        separator={IconChevronRight}
                        navigation={navigation}
                        icon
                        title
                        rightAlign
                    />
                </div>
                // </Grid>
            )}
            <div className={classes.grow} />
            <div className={classes.grow} />
            {/* <Hidden smDown>
                <Customization />
            </Hidden> */}

            {/* <NotificationSection /> */}
            <ProfileSection />
            {/* <Hidden smUp>
                <MobileSection />
            </Hidden> */}
        </React.Fragment>
    );
};

export default Header;
