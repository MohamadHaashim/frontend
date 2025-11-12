import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions } from '@material-ui/core';
import { gridSpacing } from '../../store/constant';
import SubCard from '../../ui-component/cards/SubCard';
import EventList from './List';
import EventForm from './Form';
import { fetchEvents, addEvent, updateEvent, deleteEvent,getYears,fetchEventfilter } from '../../services/events';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { environment } from '../../environments/enviornments';
import { useDebounce } from '../../hooks/useDebounce';


const EventManager = () => {
    const [categories, setCategories] = useState([]);
    const [categoryInputs, setCategoryInputs] = useState([{ englishName: '', tamilName: '', image: '' }]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [years, setYears] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [votingEvents, setVotingEvents] = useState([]);

    const API_BASE_URL = environment.apiBaseUrl;

    const debouncedSearchValue = useDebounce(searchValue, 500);

    //  const debouncedSearchValue = useDebounce(searchValue, 300);
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant, message) => {
        console.log("this si calling")
        enqueueSnackbar(message, { variant });
    };

    const loadCategories = async (Event) => {
        setLoading(true)
        try {
            const response = await fetchEvents({ event_name: debouncedSearchValue,voting_event_id:Event});
            if (response.code === "200" && response.responseData) {
                setCategories(response.responseData.eventList || []);
            } else {
                setCategories([])
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        setPage(0);
        loadCategories(selectedEvent);
    }, [debouncedSearchValue,selectedEvent]);
    

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
            loadYears();
        }, []);

        //  const loadEvent = async (year, category, name) => {
        //         setLoading(true)
        //         try {
        //             const response = await fetchEventfilter({ nominee_name: name, year: year, category_id: category });
        //             if (response.code === "200") {
        //                 setCategories(response.responseData.nomineeList || []);
        //             } else {
        //                 setCategories([])
        //                 console.error('Failed to fetch nominees:', response.message);
        //             }
        //         } catch (error) {
        //             console.error('Error while fetching nominees:', error);
        //         } finally {
        //             setLoading(false)
        //         }
        //     };

        useEffect(() => {
                let updatedEvent= [...categories];
        
                // Apply filters
                if (selectedEvent) {
                    updatedEvent = updatedEvent.filter(n => n.event_id === selectedEvent);
                }
                // if (selectedCategory) {
                //     updatedEvent = updatedEvent.filter(n => n.category_id === selectedCategory);
                // }
                // if (debouncedSearchValue) {
                //     updatedEvent = updatedEvent.filter(n =>
                //         n.event_name_english.toLowerCase().includes(debouncedSearchValue.toLowerCase())
                //     );
        
                // Apply sorting
                if (sortColumn) {
                    updatedEvent.sort((a, b) => {
                        const isAsc = sortOrder === 'asc';
                        if (sortColumn === 'srNo') {
                            return isAsc ? a.id - b.id : b.id - a.id;
                        }
                        if (sortColumn === 'event_name_english') {
                            return isAsc
                                ? a.event_name_english.localeCompare(b.event_name_english)
                                : b.event_name_english.localeCompare(a.event_name_english);
                        }
                        if (sortColumn === 'event_name_tamil') {
                            return isAsc
                                ? a.event_name_tamil.localeCompare(b.event_name_tamil)
                                : b.event_name_tamil.localeCompare(a.event_name_tamil);
                        }
                        return 0;
                    });
                }
        
                setCategories(updatedEvent);
            }, []);

            // useEffect(() => {
            //         setPage(0);
            //         loadEvent(selectedYear);
            //     }, [ debouncedSearchValue,selectedYear])

        const loadVotingEvents = async () => {
                    setLoading(true)
                    try {
                        const response = await fetchEvents();
                        if (response.code === "200") {
                            setVotingEvents(response.responseData.eventList || []);
                        }
                    } catch (error) {
                        console.error('Failed to fetch categories:', error);
                    } finally{
                        setLoading(false)
                    }
                };

        useEffect(() => {
                loadVotingEvents();
            },[])

    // Sort categories
    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortColumn(column);

        const sorted = [...categories].sort((a, b) => {
            if ((a[column] || '') < (b[column] || '')) return isAsc ? 1 : -1;
            if ((a[column] || '') > (b[column] || '')) return isAsc ? -1 : 1;

            return 0;
        });

        setCategories(sorted);
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedCategories = categories.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleSaveCategories = async () => {
        setLoading(true)
        try {
            const formData = new FormData();

            if (editMode) {

                formData.append('event_id[]', editingCategoryId);
                formData.append('event_name_english[]', categoryInputs[0].englishName);
                formData.append('event_name_tamil[]', categoryInputs[0].tamilName);

                const response = await updateEvent(formData);

                if (response.code === "200") {
                    loadCategories();
                    setEditMode(false);
                    setEditingCategoryId(null);
                    setOpen(false);
                    setCategoryInputs([{ englishName: '', tamilName: '', image: '', file: null }]);
                    handleClickVariant('success', 'Event updated successfully!');
                } else {
                    console.log("comes in this part")
                    handleClickVariant('error', response.message || 'Failed to update category');
                }
            } else {
                categoryInputs.forEach((input, index) => {
                    formData.append(`event_name_english[${index}]`, input.englishName);
                    formData.append(`event_name_tamil[${index}]`, input.tamilName);
                    
                });

                const response = await addEvent(formData);

                if (response.code === "200") {
                    loadCategories();
                    setOpen(false);
                    setCategoryInputs([{ englishName: '', tamilName: '', image: '', file: null }]);
                    handleClickVariant('success', response.message);
                } else {
                    handleClickVariant('error', response.message || 'Failed to add category');
                }
            }

        } catch (error) {
            console.error('Error saving categories:', error);
            handleClickVariant('error', 'An error occurred while saving the category.');
        } finally {
            setLoading(false)
        }
    };

    const handleEditCategory = (category) => {
        setCategoryInputs([{
            englishName: category.event_name_english,
            tamilName: category.event_name_tamil,
        }]);
        setEditingCategoryId(category.id);
        setEditMode(true);
        setOpen(true);
    };

    const handleRemoveCategory = async () => {
        setLoading(true)
        try {
            if (!categoryToDelete) return;

            const response = await deleteEvent(categoryToDelete);

            if (response.code === "200") {
                loadCategories();
                handleClickVariant('success', 'Event deleted successfully!');
            } else {
                handleClickVariant('error', response.message || 'Failed to delete category');
            }

            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error('Error deleting category:', error);
            handleClickVariant('error', 'An error occurred while deleting the category.');
        } finally {
            setLoading(false)
        }
    };


    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Event List"
                        action={
                            <Button variant="contained" color="primary" onClick={() => { setOpen(true); setEditMode(false) }}>
                                Add Event
                            </Button>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <SubCard title="">
                                    <EventList
                                        categories={paginatedCategories}
                                        totalCategories={categories.length}
                                        searchValue={searchValue}
                                        setSearchValue={setSearchValue}
                                        sortColumn={sortColumn}
                                        sortOrder={sortOrder}
                                        onSort={handleSort}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        loading={loading}
                                        votingEvents={votingEvents}
                                        selectedEvent={selectedEvent}
                                        onEventChange={setSelectedEvent}
                                        onEditCategory={handleEditCategory}
                                        onRemoveCategory={(categoryId) => {
                                            setCategoryToDelete(categoryId);
                                            setDeleteDialogOpen(true);
                                        }}
                                    />
                                </SubCard>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <EventForm
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditMode(false);
                    setCategoryInputs([{ englishName: '', tamilName: '', image: '', file: null }]);
                }}

                categoryInputs={categoryInputs}
                onSave={handleSaveCategories}
                onCategoryInputChange={(index, e) => {
                    const { name, value } = e.target;
                    const updatedInputs = [...categoryInputs];
                    updatedInputs[index][name] = value;
                    setCategoryInputs(updatedInputs);
                }}
                onImageChange={(index, e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const updatedInputs = [...categoryInputs];
                        updatedInputs[index].image = URL.createObjectURL(file);
                        updatedInputs[index].file = file;
                        setCategoryInputs(updatedInputs);
                    }
                }}

                editMode={editMode}
                handleAddCategoryInput={() => setCategoryInputs([...categoryInputs, { englishName: '', tamilName: '', image: '' }])}
                handleRemoveCategoryInput={(index) =>
                    setCategoryInputs((prevInputs) => prevInputs.filter((_, i) => i !== index))
                }
                loading={loading}
            />

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>
                    <Typography variant="h5">Confirm Deletion</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this category?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDeleteDialogOpen(false); setEditMode(false) }} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleRemoveCategory} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default EventManager;
