import React, { useState, useEffect } from 'react'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormControl, InputLabel, Select, MenuItem, OutlinedInput, InputAdornment, TablePagination } from '@material-ui/core';
import { IconSearch, IconX } from '@tabler/icons';
import { environment } from '../../environments/enviornments';
import noImage from '../../assets/images/images/noimage.jpg'
import RoundLoader from '../../ui-component/extended/Loader/RoundLoader';

const VotingList = ({
    votingList,
    totalVotingList,
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
    loading

}) => {
    // console.log("votings from voting", votings)

    const API_BASE_URL = environment.apiBaseUrl;
    console.log('voting list in her', votingList)
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
                            label="Year"
                        >
                            <MenuItem value="">All</MenuItem>
                            {votingEvents.map((events, index) => (
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
                            {categories.map((category, index) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.category_name_english}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {loading ? (<RoundLoader />) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', cursor: '' }}
                                    // onClick={() => handleSort('srNo')}
                                    >
                                        Sr. No.
                                        {sortColumn === 'srNo' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => onSort('category_name_english')}>
                                        Category Name
                                        {sortColumn === 'category_name_english' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => onSort('nominee_name_english')}>
                                        Nominee Name (English)
                                        {sortColumn === 'nominee_name_english' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nominee Name (Tamil)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nominee Image</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => onSort('voting_count')}>
                                        Votings
                                        {sortColumn === 'voting_count' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>


                            <TableBody>
                                {votingList.length > 0 ? (
                                    votingList.map((voting, index) => (
                                        <TableRow key={voting.id}>
                                            <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                                            <TableCell>{voting.category_name_english}</TableCell>
                                            <TableCell>{voting.nominee_name_english}</TableCell>
                                            <TableCell>{voting.nominee_name_tamil}</TableCell>
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
                                                            voting.image_data && voting.image_data.image_url
                                                                ? `${API_BASE_URL}${voting.image_data.image_url}`
                                                                : noImage
                                                        }
                                                        alt="Nominee image"
                                                        // height="60"
                                                        // width="60"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50px', }}
                                                        // style={{ borderRadius: '0%' }}
                                                        onError={(e) => e.target.src = noImage}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                {voting.voting_count}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" style={{ padding: "100px" }}>
                                            No votings found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={totalVotingList}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                    />
                </>
            )}

        </>
    )
}

export default VotingList