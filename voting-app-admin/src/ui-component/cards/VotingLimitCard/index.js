import React, { useState, useEffect } from 'react';
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Typography } from '@material-ui/core';

import { IconLockAccess } from '@tabler/icons'
import { getVoteLimit } from '../../../services/settings';

const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.palette.grey.dark,
        color: theme.palette.grey.light,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: 'linear-gradient(210.04deg, #90CAF9 -50.94%, rgba(144, 202, 249, 0) 83.49%)',
            borderRadius: '50%',
            top: '-30px',
            right: '-180px'
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: 'linear-gradient(140.9deg, #90CAF9 -14.02%, rgba(144, 202, 249, 0) 77.58%)',
            borderRadius: '50%',
            top: '-160px',
            right: '-130px'
        }
    },content: {
        padding: '16px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.dark
    },
    secondary: {
        color: theme.palette.grey.light,
        marginTop: '5px'
    },
    padding: {
        paddingTop: 0,
        paddingBottom: 0
    }
}));

const VotingLimitCard = () => {
    const classes = useStyles();
    const [votingLimit, setVotingLimit] = useState(true)

    const loadGetVoteLimit = async () => {
        try {
            const response = await getVoteLimit();
            if (response.code === '200' && response.responseData) {
                setVotingLimit(response.responseData.voteLimit || '');
            } else {
                console.error('Unexpected response format for years:', response);
            }
        } catch (error) {
            console.error('Failed to fetch years:', error);
        }
    };

    useEffect(() => {
        loadGetVoteLimit()
    }, [])

    return (
        <Card className={classes.card}>
        <CardContent className={classes.content}>
            <List className={classes.padding}>
                <ListItem alignItems="center" disableGutters className={classes.padding}>
                    <ListItemAvatar>
                        <Avatar variant="rounded" className={classes.avatar}>
                            <IconLockAccess fontSize="inherit" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        className={classes.padding}
                        primary={
                            <Typography variant="subtitle3" className={classes.secondary}>
                                Vote Limit
                            </Typography>
                        }
                        secondary={
                            <Typography variant="h4" className={classes.primary}>
                                {votingLimit ? "Yes":"No"}
                            </Typography>

                        }
                    />
                </ListItem>
            </List>
        </CardContent>
    </Card>
    );
};

export default VotingLimitCard;
