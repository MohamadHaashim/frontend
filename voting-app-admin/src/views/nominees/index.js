import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import { gridSpacing } from '../../store/constant';
import SubCard from '../../ui-component/cards/SubCard';
import NomineeList from './List';
import NomineeForm from './Form';
import { fetchCategories } from '../../services/category';
import { addNominee, updateNominee, fetchNominees, deleteNominee, getYears } from '../../services/nominees';
import { environment } from '../../environments/enviornments';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchEvents} from '../../services/events';

const NomineeManager = () => {
    const [nominees, setNominees] = useState([]);
    const [nomineeInputs, setNomineeInputs] = useState([{
        event_id: '',
        category_id: '',
        nomineeNameEnglish: '',
        nomineeNameTamil: '',
        nomineeImage: '',
        videoUrl: '',
        order:'',
    }]);

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingNomineeId, setEditingNomineeId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [votingEvents, setVotingEvents] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [nomineeToDelete, setNomineeToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filteredNominees, setFilteredNominees] = useState([]);
    const [years, setYears] = useState([]);
    const debouncedSearchValue = useDebounce(searchValue, 500);

    const API_BASE_URL = environment.apiBaseUrl;

    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => {
        enqueueSnackbar(message, { variant });
    };
    const handleOpenDialog = () => {
        setOpen(true);
        setNomineeInputs([{ event_id: '', category_id: '', nomineeNameEnglish: '', nomineeNameTamil: '', file: null, videoUrl: '',order:''}]);

    }
    const handleCloseDialog = () => {
        setOpen(false);
        setEditMode(false);
        setEditingNomineeId(null);
    };

    const loadCategories = async () => {
        setLoading(true)
        try {
            const response = await fetchCategories();
            if (response.code === "200") {
                setCategories(response.responseData.categoryList || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally{
            setLoading(false)
        }
    };

    const loadVotingEvents = async () => {
        setLoading(true)
        try {
            const response = await fetchEvents();
            if (response.code === "200") {
                setVotingEvents(response.responseData.eventList || []);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally{
            setLoading(false)
        }
    };

    const loadNominees = async (Event, category, name) => {
        setLoading(true)
        try {
            const response = await fetchNominees({ nominee_name: name, voting_event_id: Event, category_id: category });
            if (response.code === "200") {
                setNominees(response.responseData.nomineeList || []);
            } else {
                setNominees([])
                console.error('Failed to fetch nominees:', response.message);
            }
        } catch (error) {
            console.error('Error while fetching nominees:', error);
        } finally {
            setLoading(false)
        }
    };
    // loadNominees();

    const loadYears = async () => {
        setLoading(true)
        try {
            const response = await getYears();
            if (response.code === "200" && response.responseData) {
                setYears(response.responseData.yearsList || []);
            } else {
                console.error('Unexpected response format for years:', response);
            }
        } catch (error) {
            console.error('Failed to fetch years:', error);
        } finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        loadCategories();
        loadYears();
        loadVotingEvents();
    }, []);

    useEffect(() => {
        let updatedNominees = [...nominees];

        // Apply filters
        if (selectedEvent) {
            updatedNominees = updatedNominees.filter(n => n.event_id === selectedEvent);
        }
        if (selectedCategory) {
            updatedNominees = updatedNominees.filter(n => n.category_id === selectedCategory);
        }
        if (debouncedSearchValue) {
            updatedNominees = updatedNominees.filter(n =>
                n.nominee_name_english.toLowerCase().includes(debouncedSearchValue.toLowerCase())
            );
        }

        // Apply sorting
        if (sortColumn) {
            updatedNominees.sort((a, b) => {
                const isAsc = sortOrder === 'asc';
                if (sortColumn === 'srNo') {
                    return isAsc ? a.id - b.id : b.id - a.id;
                }
                if (sortColumn === 'category_name_english') {
                    return isAsc
                        ? a.category_name_english.localeCompare(b.category_name_english)
                        : b.category_name_english.localeCompare(a.category_name_english);
                }
                if (sortColumn === 'nominee_name_english') {
                    return isAsc
                        ? a.nominee_name_english.localeCompare(b.nominee_name_english)
                        : b.nominee_name_english.localeCompare(a.nominee_name_english);
                }
                return 0;
            });
        }

        setFilteredNominees(updatedNominees);
    }, [nominees, sortColumn, sortOrder]);

    useEffect(() => {
        setPage(0);
        loadNominees(selectedEvent, selectedCategory, debouncedSearchValue);
    }, [debouncedSearchValue, selectedEvent, selectedCategory])

    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortColumn(column);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedNominees = filteredNominees.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage);

    const handleNomineeInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedNomineeInputs = [...nomineeInputs];
        updatedNomineeInputs[index][name] = value;
        setNomineeInputs(updatedNomineeInputs);
    };

    const handleImageChange = (index, event) => {
        const file = event.target.files[0];
        if (file) {
            const updatedNomineeInputs = [...nomineeInputs];
            updatedNomineeInputs[index].nomineeImage = file; // Store the file
            updatedNomineeInputs[index].nomineeImagePreview = URL.createObjectURL(file); // Store preview URL
            setNomineeInputs(updatedNomineeInputs);
        }
    };

    const handleSaveNominees = async () => {
        setLoading(true)
        try {
            const formData = new FormData();

            // Check if we are in edit mode (updating nominee)
            if (editMode) {
                formData.append('nominee_id[]', editingNomineeId);
                nomineeInputs.forEach((input, index) => {
                    formData.append('voting_event_id', input.event_id);
                    formData.append('category_id', input.category_id);
                    formData.append('nominee_name_english[]', input.nomineeNameEnglish);
                    formData.append('nominee_name_tamil[]', input.nomineeNameTamil);
                    formData.append('video_url[]', input.videoUrl);
                    formData.append('nominee_order[]', input.order);

                    if (input.nomineeImage) {
                        formData.append('nominee_image[]', input.nomineeImage);
                    }
                });

                const response = await updateNominee(formData);

                if (response.code === "200") {
                    handleClickVariant('success', 'Nominee updated successfully!');
                    loadNominees();
                    handleCloseDialog();
                } else {
                    handleClickVariant('error', response.message);
                    console.error('Failed to update nominee:', response.message);
                }
            } else {
                // Add new nominees
                // formData.append('voting_event_id', nomineeInputs[0].event_id);
                formData.append('category_id', nomineeInputs[0].category_id);
                nomineeInputs.forEach((input) => {
                    formData.append('voting_event_id', input.event_id);
                    formData.append('nominee_name_english[]', input.nomineeNameEnglish);
                    formData.append('nominee_name_tamil[]', input.nomineeNameTamil);
                    formData.append('video_url[]', input.videoUrl);
                    formData.append(`nominee_order[]`, input.order);

                    if (input.nomineeImage) {
                        formData.append('nominee_image[]', input.nomineeImage);
                    }
                });

                const response = await addNominee(formData);

                if (response.code === "200") {
                    handleClickVariant('success', response.message);
                    loadNominees();
                    handleCloseDialog();
                } else {
                    handleClickVariant('error', response.message);
                    console.error('Failed to add nominee:', response.message);
                }
            }
        } catch (error) {
            console.log("Error in Nominee save", error)
        } finally {
            setLoading(false)
        }

    };

    const handleAddNomineeInput = () => {
        setNomineeInputs([...nomineeInputs, {
            event_id: '',
            category_id: '',
            nomineeNameEnglish: '',
            nomineeNameTamil: '',
            nomineeImage: '',
            videoUrl: '',
            order:'',
        }]);
    };

    const handleRemoveNomineeInput = (index) => {
        setNomineeInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
    };

    // Handle nominee deletion
    const handleDeleteNominee = async () => {
        setLoading(true)
        try {
            const response = await deleteNominee(nomineeToDelete);
            if (response.code === "200") {
                setNominees(nominees.filter((nominee) => nominee.id !== nomineeToDelete));
                handleClickVariant('success', 'Nominee deleted successfully!');
                loadNominees();
                setDeleteDialogOpen(false);
            } else {
                handleClickVariant('error', response.message);
                console.error('Failed to delete nominee:', response.message);
            }
        } catch (error) {
            handleClickVariant('error', 'Error deleting nominee');
            console.error('Error while deleting nominee:', error);
        } finally {
            setLoading(false)
        }
    };

    const openDeleteDialog = (nomineeId) => {
        setNomineeToDelete(nomineeId);
        setDeleteDialogOpen(true);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Nominee List"
                        action={
                            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                                Add Nominee
                            </Button>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <SubCard title="">
                                    <NomineeList
                                        nominees={paginatedNominees}
                                        totalNominees={nominees.length}
                                        votingEvents={votingEvents}
                                        categories={categories}
                                        selectedEvent={selectedEvent}
                                        selectedCategory={selectedCategory}
                                        searchValue={searchValue}
                                        onEventChange={setSelectedEvent}
                                        onCategoryChange={setSelectedCategory}
                                        onSearchChange={setSearchValue}
                                        onSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortOrder={sortOrder}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        onAddNominees={handleSaveNominees}
                                        onEditNominee={(nominee) => {
                                            setNomineeInputs([{
                                                event_id: nominee.event_id,
                                                order:nominee.nominee_order,
                                                category_id: nominee.category_id,
                                                nomineeNameEnglish: nominee.nominee_name_english,
                                                nomineeNameTamil: nominee.nominee_name_tamil,
                                                nomineeImage: API_BASE_URL + nominee.image_data.image_url,
                                                nomineeImagePreview: API_BASE_URL + nominee.image_data.image_url,
                                                videoUrl: nominee.video_url,
                                            }]);
                                            setEditingNomineeId(nominee.id);
                                            setEditMode(true);
                                            setOpen(true);
                                        }}
                                        onRemoveNominee={(id) => {
                                            openDeleteDialog(id);
                                        }}
                                        loading={loading}
                                    />
                                </SubCard>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Nominee Form Dialog */}
            <NomineeForm
                open={open}
                onClose={handleCloseDialog}
                nomineeInputs={nomineeInputs}
                onSave={handleSaveNominees}
                onNomineeInputChange={handleNomineeInputChange}
                onImageChange={handleImageChange}
                categories={categories}
                votingEvents={votingEvents}
                editMode={editMode}
                handleAddNomineeInput={handleAddNomineeInput}
                handleRemoveNomineeInput={handleRemoveNomineeInput}
                loading={loading}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>
                    <Typography variant="h5">Confirm Deletion</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this nominee?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteNominee} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default NomineeManager;
