import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions } from '@material-ui/core';
import { gridSpacing } from '../../store/constant';
import SubCard from '../../ui-component/cards/SubCard';
import CategoryList from './List';
import CategoryForm from './Form';
import { fetchCategories, addCategory, updateCategory, deleteCategory,getYears,fetchcategoryfilter } from '../../services/category';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { environment } from '../../environments/enviornments';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchEvents, getVotingEvents } from '../../services/events';


const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [categoryInputs, setCategoryInputs] = useState([{ englishName: '', tamilName: '', image: '', order:'',event_id:''}]);
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
    const [votingEvents, setVotingEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
     const [years, setYears] = useState([]);
 

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
            const response = await fetchCategories({ category_name: debouncedSearchValue,voting_event_id:Event });
            if (response.code === "200" && response.responseData) {
                setCategories(response.responseData.categoryList || []);
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

    useEffect(() => {
        loadVotingEvents();
    },[])

    useEffect(() => {
                    let updatedcategory= [...categories];
            
                    // Apply filters
                    if (selectedEvent) {
                        updatedcategory = updatedcategory.filter(n => n.event_id === selectedEvent);
                    }
                    // if (selectedCategory) {
                    //     updatedcategory = updatedcategory.filter(n => n.category_id === selectedCategory);
                    // }
                    // if (debouncedSearchValue) {
                    //     updatedcategory = updatedcategory.filter(n =>
                    //         n.event_name_english.toLowerCase().includes(debouncedSearchValue.toLowerCase())
                    //     );
            
                    // Apply sorting
                    if (sortColumn) {
                        updatedcategory.sort((a, b) => {
                            const isAsc = sortOrder === 'asc';
                            if (sortColumn === 'srNo') {
                                return isAsc ? a.id - b.id : b.id - a.id;
                            }
                            if (sortColumn === 'category_name_english') {
                                return isAsc
                                    ? a.category_name_english.localeCompare(b.category_name_english)
                                    : b.category_name_english.localeCompare(a.category_name_english);
                            }
                            if (sortColumn === 'category_name_tamil') {
                                return isAsc
                                    ? a.category_name_tamil.localeCompare(b.category_name_tamil)
                                    : b.category_name_tamil.localeCompare(a.category_name_tamil);
                            }
                            return 0;
                        });
                    }
            
                    setCategories(updatedcategory);
                }, []);
    
                useEffect(() => {
                        setPage(0);     
                    }, [ selectedEvent])
          

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
                formData.append('category_id[]', editingCategoryId);
                formData.append(`voting_event_id`, categoryInputs[0].event_id);
                formData.append('category_name_english[]', categoryInputs[0].englishName);
                formData.append('category_name_tamil[]', categoryInputs[0].tamilName);
                formData.append(`category_order[]`, categoryInputs[0].order);

                if (categoryInputs[0].file) {
                    formData.append('category_image[]', categoryInputs[0].file);
                }

                const response = await updateCategory(formData);

                if (response.code === "200") {
                    loadCategories();
                    setEditMode(false);
                    setEditingCategoryId(null);
                    setOpen(false);
                    setCategoryInputs([{ englishName: '', tamilName: '', image: '',order:'',event_id:'',file: null }]);
                    handleClickVariant('success', 'Category updated successfully!');
                } else {
                    console.log("comes in this part")
                    handleClickVariant('error', response.message || 'Failed to update category');
                }
            } else {
                categoryInputs.forEach((input, index) => {
                    formData.append(`voting_event_id`, input.event_id);
                    formData.append(`category_name_english[${index}]`, input.englishName);
                    formData.append(`category_name_tamil[${index}]`, input.tamilName);
                    formData.append(`category_order[${index}]`, input.order);
                    if (input.file) {
                        formData.append(`category_image[${index}]`, input.file);
                    }
                });

                const response = await addCategory(formData);

                if (response.code === "200") {
                    loadCategories();
                    setOpen(false);
                    setCategoryInputs([{ event_id:'',englishName: '', tamilName: '',order:'',image: '', file: null }]);
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
            englishName: category.category_name_english,
            tamilName: category.category_name_tamil,
            event_id:category.event_id,
            order:category.category_order,
            image: API_BASE_URL + category?.image_data?.image_url,
        }]);
        setEditingCategoryId(category.id);
        setEditMode(true);
        setOpen(true);
    };

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

    const handleRemoveCategory = async () => {
        setLoading(true)
        try {
            if (!categoryToDelete) return;

            const response = await deleteCategory(categoryToDelete);

            if (response.code === "200") {
                loadCategories();
                handleClickVariant('success', 'Category deleted successfully!');
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
                        title="Category List"
                        action={
                            <Button variant="contained" color="primary" onClick={() => { setOpen(true); setEditMode(false) }}>
                                Add Category
                            </Button>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <SubCard title="">
                                    <CategoryList
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
                                        years={years}
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

            <CategoryForm
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditMode(false);
                    setCategoryInputs([{ englishName: '', tamilName: '', image: '', event_id:'', order:'',file: null }]);
                }}
                votingEvents={votingEvents}
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
                handleAddCategoryInput={() => setCategoryInputs([...categoryInputs, { englishName: '', tamilName: '', image: '', order:'',event_id:'' }])}
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

export default CategoryManager;
