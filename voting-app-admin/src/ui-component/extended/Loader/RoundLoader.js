import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    loaderWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: '200px',
        zIndex: 10
    },
}));

const RoundLoader = () => {
    const classes = useStyles();

    return (
        <div className={classes.loaderWrapper}>
            <CircularProgress color="primary" />
            {/* <CircularProgress color="secondary" size={60} /> */}

        </div>
    );
};

export default RoundLoader;
