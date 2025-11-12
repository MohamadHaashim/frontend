import React from 'react';
import {
    Grid,
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TablePagination,
    Box,
    InputLabel, Select, MenuItem,
} from '@material-ui/core';
import { IconSearch, IconX } from '@tabler/icons';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import noImage from '../../assets/images/images/noimage.jpg';
import RoundLoader from '../../ui-component/extended/Loader/RoundLoader';
import { environment } from '../../environments/enviornments';

const EventList = ({
    categories,
    totalCategories,
    searchValue,
    setSearchValue,
    sortColumn,
    sortOrder,
    onSort,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    loading,
    onEditCategory,
    selectedEvent,
    votingEvents,
    onEventChange,
    onRemoveCategory, }) => {

    const API_BASE_URL = environment.apiBaseUrl;
    return (
        <>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                        <OutlinedInput
                            id="input-search-profile"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search by event name"
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="1.3rem" />
                                </InputAdornment>
                            }
                            endAdornment={
                                searchValue && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setSearchValue('')} edge="end">
                                            <IconX stroke={1.5} size="1.3rem" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            aria-describedby="search-helper-text"
                            inputProps={{ 'aria-label': 'search' }}
                            labelWidth={0}
                        />
                    </FormControl>
                </Grid>
                {/* <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Event</InputLabel>
                        <Select
                            value={selectedEvent}
                            onChange={(e) => onEventChange(e.target.value)}
                            label="Year"
                        >
                            <MenuItem value="">All</MenuItem>
                            {votingEvents.map((events) => (
                                <MenuItem ey={events.id} value={events.id}>
                                    {events.event_name_english}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid> */}
            </Grid>
            {loading ? (
                <RoundLoader />
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Sr. No.</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => onSort('category_name_english')}>
                                        Event Name (English) {sortColumn === 'category_name_english' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Event Name (Tamil)</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <TableRow key={category.id}>
                                            <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                            <TableCell>{category.event_name_english}</TableCell>
                                            <TableCell>{category.event_name_tamil}</TableCell>
                                            
                                            <TableCell align="center">
                                                <Box display="flex" justifyContent="center" alignItems="center" >
                                                    <IconButton color="primary" onClick={() => onEditCategory(category)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton style={{ color: 'red' }} onClick={() => onRemoveCategory(category.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" style={{ padding: '100px' }}>
                                            No events found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={totalCategories}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                    />
                </>
            )}
        </>
    );
};

export default EventList;
