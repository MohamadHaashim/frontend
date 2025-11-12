import React, { use, useEffect, useState } from 'react';
import { Card, CardContent, Divider, Grid, Select, MenuItem, FormControl, InputLabel, Switch, Typography, Button, DialogContentText } from '@material-ui/core';
import { gridSpacing } from '../../store/constant';
import SubCard from '../../ui-component/cards/SubCard';
import { getYears } from '../../services/nominees';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import { listYearToShowNominees, getVoteLimit, addYearToShowNominees, addVoteLimit, landingPageLogoList, landingPageLogoUpdate } from '../../services/settings';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { environment } from '../../environments/enviornments';
import { fetchEvents, AddEventRelease } from '../../services/events';

const Settings = () => {
    const [votingLimit, setVotingLimit] = useState(true);
    const [years, setYears] = useState([]);
    const [showYear, setShowYear] = useState('')
    const [selectedEvent, setSelectedEvent] = useState("");
    const [votingRelese, setVotingRelese] = useState([]);
    const [logoDetails, setLogoDetails] = useState({
        id: null,
        previewUrl: null,
        file: null, 
    });

    const API_BASE_URL = environment.apiBaseUrl;

    const HiddenInput = styled('input')({
        display: 'none',
    });

    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => {
        enqueueSnackbar(message, { variant });
    };

    // Load years from API
    const loadYears = async () => {
        try {
            const response = await getYears();
            if (response.code === '200' && response.responseData) {
                setYears(response.responseData.yearsList || []);
            } else {
                console.error('Unexpected response format for years:', response);
            }
        } catch (error) {
            console.error('Failed to fetch years:', error);
        }
    };

    const loadlistYearToShowNominees = async () => {
        try {
            const response = await listYearToShowNominees();
            if (response.code === '200' && response.responseData) {
                setShowYear(response.responseData.showToUserYear || []);
            } else {
                console.error('Unexpected response format for years:', response);
            }
        } catch (error) {
            console.error('Failed to fetch years:', error);
        }
    };

    const loadEvents = async () => {
        try {
            const response = await fetchEvents();
            if (response.code === "200") {
                const events = response.responseData.eventList || [];

                setVotingRelese(events); 
                
                const defaultEvent = events.find(event => event.active_status === true);
                if (defaultEvent) {
                    setSelectedEvent(defaultEvent.id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally{
            
        }
    };
    const AddVotingEvents = async () => {
        try {
            const response = await AddEventRelease({voting_event_id:selectedEvent});
            console.log(selectedEvent,"voting_event_id")
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally{
            
        }
    };

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

    const handleAddYearToShowNominees = async (year) => {
        try {
            const response = await addYearToShowNominees({ year: year });
            if (response.code === '200') {
                handleClickVariant('success', response.message);
            } else {
                console.error('Unexpected response format for years:', response);
            }
        } catch (error) {
            console.error('Failed to fetch years:', error);
        }
    };

    const handleAddVoteLimit = async (limit) => {
        try {
            console.log("limit in add vote function", limit)
            const response = await addVoteLimit({ limit: limit });
            if (response.code === '200') {
                handleClickVariant('success', response.message);
            } else {
                console.error('Unexpected response format for years:', response);
            }
        } catch (error) {
            console.error('Failed to fetch years:', error);
        }
    };

    const loadLandingPageLogoList = async () => {
        try {
            const response = await landingPageLogoList();
            if (response.code === '200' && response.responseData) {
                setLogoDetails({
                    id: response.responseData.img_id,
                    previewUrl: API_BASE_URL + response.responseData.image_url,
                    file: null,
                });
            } else {
                console.error('Unexpected response format for logo list:', response);
            }
        } catch (error) {
            console.error('Failed to fetch logo list:', error);
        }
    };

    const handleYearChange = (event) => {
        console.log("year change:", event.target.value)
        setShowYear(event.target.value);
        handleAddYearToShowNominees(event.target.value)
    };

    const handleVotingLimitChange = (event) => {
        const limit = event.target.checked ? "yes" : "no";
        console.log("limit in limit change event", limit)
        setVotingLimit(event.target.checked);
        handleAddVoteLimit(limit);
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLogoDetails({
                ...logoDetails,
                file: file,
                previewUrl: URL.createObjectURL(file), 
            });

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await landingPageLogoUpdate(formData);
                if (response.code === "200") {
                    handleClickVariant('success', 'Logo uploaded successfully!');
                    setLogoDetails({
                        id: response.responseData.img_id,
                        previewUrl: API_BASE_URL + response.responseData.image_url,
                        file: null,
                    });
                    loadLandingPageLogoList(); 
                } else {
                    handleClickVariant('error', response.message);
                    loadLandingPageLogoList();
                    // setLogoDetails({
                    //     id: '',
                    //     previewUrl: '',
                    //     file: null,
                    // });
                    console.error('Failed to update logo:', response.message);
                }
            } catch (error) {
                console.error('Error during logo update:', error);
                handleClickVariant('error', 'Failed to upload logo!');
            }
        }
    };


        const onEventChange = (value) => {
            setSelectedEvent(value);
        };

    useEffect(() => {
        // loadYears();
        // loadlistYearToShowNominees();
        loadGetVoteLimit();
        loadLandingPageLogoList();
        loadEvents();
    }, []);
    useEffect(() => {
        console.log("dropdown trigger",selectedEvent);
        
    AddVotingEvents()
}, [selectedEvent]);
    

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Card>
                    <Divider />
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            {/* Year Selection */}
                            <Grid item xs={12}>
                                <SubCard title="Select Event For Relese Voting">
                                    <FormControl fullWidth variant="outlined">
                                    <InputLabel>Event</InputLabel>
                                        <Select
                                            value={selectedEvent}
                                            onChange={(e) => onEventChange(e.target.value)}
                                            label="Event"
                                        >
                                            {/* <MenuItem value="">All</MenuItem> */}
                                             <MenuItem value="">All</MenuItem>
                                            {votingRelese.map((events) => (
                                                <MenuItem key={events.id} value={events.id}>
                                                    {events.event_name_english}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                    </FormControl>
                                </SubCard>
                            </Grid>

                            {/* Voting Limit Toggle */}
                            <Grid item xs={12}>
                                <SubCard title="Set Voting Limit">
                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid item>
                                            <Typography>Voting Limit</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Switch
                                                checked={votingLimit}
                                                onChange={handleVotingLimitChange}
                                                color="primary"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography>{votingLimit ? 'Yes' : 'No'}</Typography>
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </Grid>

                            {/* Logo Upload */}
                            <Grid item xs={12}>
                                <SubCard title="Upload Landing Page Logo">
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            gap: '100px',
                                            marginTop: '10px',
                                            padding: '0',
                                        }}
                                    >
                                        <div>
                                            <DialogContentText
                                                variant="body2"
                                                style={{ marginBottom: '10px' }}
                                            >
                                                Upload Image
                                            </DialogContentText>
                                            <label htmlFor="upload-logo-button">
                                                <HiddenInput
                                                    id="upload-logo-button"
                                                    type="file"
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                />
                                                <Button
                                                    component="span"
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<CloudUploadIcon />}
                                                >
                                                    {logoDetails.file ? 'Change Image' : 'Upload Image'}
                                                </Button>
                                            </label>
                                        </div>
                                        <div
                                            style={{
                                                width: '150px',
                                                height: '150px',
                                                border: '2px solid #ccc',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#f9f9f9',
                                            }}
                                        >
                                            {logoDetails.previewUrl ? (
                                                <img
                                                    src={logoDetails.previewUrl}
                                                    alt="Logo Preview"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    style={{
                                                        color: '#aaa',
                                                        fontSize: '14px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    No Image Uploaded
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </SubCard>
                            </Grid>


                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Settings;
