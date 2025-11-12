import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Divider, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, Typography, DialogActions } from '@material-ui/core';
import { gridSpacing } from '../../store/constant';
import SubCard from '../../ui-component/cards/SubCard';
import VotingList from './List';
import { fetchCategories } from '../../services/category';
import { fetchNominees } from '../../services/nominees';
import { getYears } from '../../services/nominees';
import { useDebounce } from '../../hooks/useDebounce';
import { fetchEvents} from '../../services/events';

const VotingPage = () => {
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchValue, setSearchValue] = useState('')
    const [years, setYears] = useState([])
    const [categories, setCategories] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [votingList, setVotingList] = useState([])
    const [loading, setLoading] = useState(false)
    const [votingEvents, setVotingEvents] = useState([]);
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    // const debouncedNomineeName = useDebounce(searchValue, 500);

    const debouncedSearchValue = useDebounce(searchValue, 500);

    const handleSort = (column) => {
        const isAsc = sortColumn === column && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortColumn(column);

        const sorted = [...votingList].sort((a, b) => {
            if (column === 'srNo') {
                return isAsc ? b.id - a.id : a.id - b.id;
            }
            if (column === 'category_name_english') {
                return isAsc
                    ? (b.category_name_english || '').localeCompare(a.category_name_english || '')
                    : (a.category_name_english || '').localeCompare(b.category_name_english || '');
            }
            if (column === 'nominee_name_english') {
                return isAsc
                    ? (b.nominee_name_english || '').localeCompare(a.nominee_name_english || '')
                    : (a.nominee_name_english || '').localeCompare(b.nominee_name_english || '');
            }
            if (column === 'voting_count') {
                return isAsc ? b.voting_count - a.voting_count : a.voting_count - b.voting_count;
            }
            return 0;
        });

        setVotingList(sorted);
    };



    // votings = []
    // Fetch categories from API
    const loadCategories = async () => {
        setLoading(true)
        try {
            const response = await fetchCategories();
            if (response.code === "200" && response.responseData) {
                setCategories(response.responseData.categoryList || []);
            } else {
                console.error('Unexpected response format for categories:', response);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false)
        }
    };

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
        } finally {
            setLoading(false)
        }
    };

    const loadNominees = async (Event, category, name) => {
        setLoading(true)
        try {
            const response = await fetchNominees({ nominee_name: name, voting_event_id: Event, category_id: category })
            if (response.code === "200" && response.responseData) {
                setVotingList(response.responseData.nomineeList || []);
            } else {
                setVotingList([]);
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Failed to fetch nominees:', error);
        } finally {
            setLoading(false)
        }
    };

    const handleYearChange = (event) => {
        // setSelectedYear(event.target.value); 
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleNomineeNameChange = (event) => {
        console.log("nominee chager", event)
        setSearchValue(event.target.value);
        // setSearchValue(event.target.value);
        // loadNominees(selectedYear, selectedCategory, event.target.value);  
    };

    const handleClear = () => {
        // setSearchValue('');
        setSearchValue('')
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const paginatedList = votingList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

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

    useEffect(() => {
        loadCategories();
        loadYears();
        loadVotingEvents();
    }, []);

   

    useEffect(() => {
            let updatedNominees = [...votingList];
    
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
    
            setVotingList(updatedNominees);
        }, []);

    useEffect(() => {
        setPage(0);
        loadNominees(selectedEvent, selectedCategory, debouncedSearchValue);
    }, [selectedEvent, selectedCategory, debouncedSearchValue]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        title="Voting List"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <SubCard title="">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <VotingList
                                                votingList={paginatedList}
                                                totalVotingList={votingList.length}
                                                years={years}
                                                categories={categories}
                                                votingEvents={votingEvents}
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
                                                loading={loading}
                                            />
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

        </Grid>
    )
}

export default VotingPage