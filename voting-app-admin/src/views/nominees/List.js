import React, { useState, useEffect } from 'react';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormControl, InputLabel, Select, MenuItem, OutlinedInput, InputAdornment, TablePagination, Divider, Box } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { IconSearch, IconX } from '@tabler/icons';

import { useTheme } from '@material-ui/core/styles';
import { fetchNominees, getYears } from '../../services/nominees';
import { fetchCategories } from '../../services/category';
import { environment } from '../../environments/enviornments';
import noImage from '../../assets/images/images/noimage.jpg';
import RoundLoader from '../../ui-component/extended/Loader/RoundLoader';
import { useDebounce } from '../../hooks/useDebounce';

const NomineeList = ({ nominees,
    totalNominees,
    votingEvents,
    categories,
    selectedEvent,
    selectedCategory,
    searchValue,
    onEventChange,
    onCategoryChange,
    onSearchChange,
    onSort,
    sortColumn,
    sortOrder,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    onEditNominee,
    onRemoveNominee,
    loading

}) => {

    const theme = useTheme();

    const API_BASE_URL = environment.apiBaseUrl;
    return (
        <>
            {/* Dropdown Filters */}
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                        <OutlinedInput
                            id="input-search-profile"
                            placeholder="Search by nominee name"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="1.3rem" />
                                </InputAdornment>
                            }
                            endAdornment={
                                searchValue && (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => onSearchChange('')} edge="end">
                                            <IconX stroke={1.5} size="1.3rem" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            aria-describedby="search-helper-text"
                            inputProps={{
                                'aria-label': 'search'
                            }}
                            labelWidth={0}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Event</InputLabel>
                        <Select
                            value={selectedEvent}
                            onChange={(e) => onEventChange(e.target.value)}
                            label="Event"
                        >
                            <MenuItem value="">All</MenuItem>
                            {votingEvents.map((events) => (
                                <MenuItem key={events.id} value={events.id}>
                                    {events.event_name_english}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="">All</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.category_name_english}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Nominee Table */}
            {loading ? (
                <RoundLoader />
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{ fontWeight: 'bold', cursor: '' }}
                                    // onClick={() => handleSort('srNo')}
                                    >
                                        Sr. No. {sortColumn === 'srNo' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                        onClick={() => onSort('category_name_english')}
                                    >
                                        Category Name {sortColumn === 'category_name_english' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell
                                        sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                        onClick={() => onSort('nominee_name_english')}
                                    >
                                        Nominee Name (English)
                                        {sortColumn === 'nominee_name_english' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nominee Name (Tamil)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nominee Image</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>YouTube URL</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {nominees.length > 0 ? (
                                    nominees.map((nominee, index) => (
                                        <TableRow key={nominee.id}>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>{nominee.category_name_english}</TableCell>
                                            <TableCell>{nominee.nominee_name_english}</TableCell>
                                            <TableCell>{nominee.nominee_name_tamil}</TableCell>
                                            <TableCell>
                                            <div
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '50px',
                                                        backgroundColor: '#f9f9f9',
                                                    }}
                                                >
                                                <img
                                                    src={
                                                        nominee.image_data && nominee.image_data.image_url
                                                            ? `${API_BASE_URL}${nominee.image_data.image_url}`
                                                            : noImage
                                                    }
                                                    alt="Nominee image"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50px', }}
                                                    // style={{ borderRadius: '0%' }}
                                                    onError={(e) => e.target.src = noImage}
                                                />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <a href={nominee.video_url} target="_blank" rel="noopener noreferrer">
                                                    {nominee.video_url}
                                                </a>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box display="flex" justifyContent="center" alignItems="center" >
                                                    <IconButton color="primary" onClick={() => onEditNominee(nominee)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        style={{ color: theme.palette.error.main }}
                                                        onClick={() => onRemoveNominee(nominee.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            align="center"
                                            style={{ padding: '100px', textAlign: 'center' }}
                                        >
                                            No Nominees Found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={totalNominees}
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

export default NomineeList;
