import React, { useEffect, useState } from 'react';
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Typography } from '@material-ui/core';

import { IconCalendarStats } from '@tabler/icons'
import { listYearToShowNominees } from '../../../services/settings';
import { getEventRelease } from '../../../services/events';

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
    },
    content: {
        padding: '16px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.grey[800],
        color: '#fff'
    },
    primary: {
        // color: '#fff'
    },
    secondary: {
        color: theme.palette.grey.light,
        // marginTop: '5px'
    },
    padding: {
        paddingTop: 0,
        paddingBottom: 0
    }
}));

const NomineesShowYearCard = () => {
    const classes = useStyles();
    const [votingRelese, setVotingRelese] = useState([]);

    const loadEvents = async () => {
            try {
                const response = await getEventRelease();
                if (response.code === "200") {
                    const events = response.responseData.eventReleased.event_name_english || [];
    
                    setVotingRelese(events); 
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally{
                
            }
        };

    useEffect(() => {
        loadEvents()
    }, [])

    return (
        <Card className={classes.card}>
            <CardContent className={classes.content}>
                <List className={classes.padding}>
                    <ListItem alignItems="center" disableGutters className={classes.padding}>
                        <ListItemAvatar>
                            <Avatar variant="rounded" className={classes.avatar}>
                                <IconCalendarStats fontSize="inherit" />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.padding}
                            primary={
                                <Typography variant="subtitle3" className={classes.secondary}>
                                    Event Relesed For Voting
                                </Typography>
                            }
                            secondary={
                                <Typography variant="h4" className={classes.primary}>
                                    {votingRelese ? votingRelese:"Not set"}
                                </Typography>

                            }
                        />
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    );
};

export default NomineesShowYearCard;
