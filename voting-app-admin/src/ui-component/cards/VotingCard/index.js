import React, {useState, useEffect} from 'react';
import {Avatar, Card, CardContent, Grid, makeStyles, Menu, MenuItem, Typography} from '@material-ui/core';

import EarningIcon from './../../../assets/images/icons/earning.svg';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import GetAppTwoToneIcon from '@material-ui/icons/GetAppOutlined';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@material-ui/icons/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@material-ui/icons/ArchiveOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import { fetchVoting } from '../../../services/voting';

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.success.main,
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        padding: '10px',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            backgroundColor: theme.palette.success.dark,
            borderRadius: '50%',
            top: '-85px',
            right: '-95px',
            zIndex: 0,
            [theme.breakpoints.down('xs')]: {
                top: '-105px',
                right: '-140px'
            }
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            backgroundColor: theme.palette.success.dark,
            borderRadius: '50%',
            top: '-125px',
            right: '-15px',
            opacity: 0.7,
            zIndex: 0,
            [theme.breakpoints.down('xs')]: {
                top: '-155px',
                right: '-70px'
            }
        }
    },
    content: {
        padding: '20px !important',
        zIndex: 1,
        position: 'relative',
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.success.light,
        // color: theme.palette.warning.dark,
        marginTop: '8px',
        zIndex: 1,
    },
    cardHeading: {
        fontSize: '2.125rem',
        fontWeight: 500,
        marginRight: '8px',
        marginTop: '18px',
        marginBottom: '8px'
    },
    subHeading: {
        fontSize: '1.5rem',
        fontWeight: 500,
        color: theme.palette.success[200],
        zIndex: 1,
    },
    menuItem: {
        marginRight: '14px',
        fontSize: '1.25rem'
    }
}));

const VotingCard = () => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [votingCount, setVotingCount] = useState(0)

    const loadVotings = async () => {
        try {
            const response = await fetchVoting();
            if (response.code === "200" && response.responseData) {
                setVotingCount(response.responseData.totalVoting || 0);
            } else {
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=>{
        loadVotings()
    },[])

    return (
        <Card className={classes.card}>
            <CardContent className={classes.content}>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item>
                                        <Avatar variant="rounded" className={classes.avatar}>
                                            <PollOutlinedIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Typography className={classes.subHeading}>Votings</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Menu
                                    id="menu-voting-card"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    variant="selectedMenu"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>
                                        <GetAppTwoToneIcon fontSize="inherit" className={classes.menuItem} /> Import Card
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <FileCopyTwoToneIcon fontSize="inherit" className={classes.menuItem} /> Copy Data
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <PictureAsPdfTwoToneIcon fontSize="inherit" className={classes.menuItem} /> Export
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <ArchiveTwoToneIcon fontSize="inherit" className={classes.menuItem} /> Archive File
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Typography className={classes.cardHeading}>Votes: {votingCount}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};


export default VotingCard;
