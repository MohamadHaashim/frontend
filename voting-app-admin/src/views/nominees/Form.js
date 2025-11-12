import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, MenuItem } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useTheme } from '@material-ui/core/styles';
import RoundLoader from '../../ui-component/extended/Loader/RoundLoader';

const NomineeForm = ({
    open,
    onClose,
    nomineeInputs,
    onSave,
    onNomineeInputChange,
    onImageChange,
    handleAddNomineeInput,
    handleRemoveNomineeInput,
    categories,
    votingEvents,
    editMode,
    loading
}) => {
    const theme = useTheme();
    const [yearOptions, setYearOptions] = useState([]);
    const [errors, setErrors] = useState([]);
    const [touchedFields, setTouchedFields] = useState({});

    const validNomineeInputs = nomineeInputs && nomineeInputs.length > 0 ? nomineeInputs : [{
        event_id: '',
        category_id: '',
        nomineeNameEnglish: '',
        nomineeNameTamil: '',
        nomineeImage: '',
        videoUrl: '',
        order:'',
    }];

    const handleBlur = (index, fieldName) => {
        setTouchedFields((prevTouched) => ({
            ...prevTouched,
            [`${index}_${fieldName}`]: true,
        }));
    };


    const handleValidation = (isSubmitting = false) => {
        const newErrors = {};

        // Validate year and category dropdowns
        if ((isSubmitting || touchedFields[`0_event_id`]) && !validNomineeInputs[0].event_id) {
            newErrors.event_id = 'Event is required';
        }
        if ((isSubmitting || touchedFields[`0_category_id`]) && !validNomineeInputs[0].category_id) {
            newErrors.category_id = 'Category is required';
        }

        // Validate other fields for each nominee
        validNomineeInputs.forEach((input, index) => {
            const fieldErrors = {};

            if ((isSubmitting || touchedFields[`${index}_nomineeNameEnglish`]) && !input.nomineeNameEnglish) {
                fieldErrors.nomineeNameEnglish = 'Nominee Name (English) is required';
            }
            if ((isSubmitting || touchedFields[`${index}_nomineeImage`]) && !input.nomineeImage) {
                fieldErrors.nomineeImage = 'Nominee image is required';
            }

            if (Object.keys(fieldErrors).length > 0) {
                newErrors[index] = fieldErrors;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    useEffect(() => {
        const years = generateYears();
        setYearOptions(years);
    }, []);

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        onNomineeInputChange(index, e);

        if (name === 'voting_event_id' && value !== '') {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.Event;
                return newErrors;
            });
        }
        if (name === 'category_id' && value !== '') {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.category_id;
                return newErrors;
            });
        }

        handleValidation();
    };

    const handleImageChange = (index, e) => {
        onImageChange(index, e);
        handleValidation();
    };

    // const handleSave = () => {
    //     if (handleValidation()) {
    //         onSave();
    //     }
    // };
    const handleSave = () => {
        const isValid = handleValidation(true);
        if (isValid) {
            onSave();
        }
    };

    useEffect(() => {
        if (!open) {
            setErrors({});
            setTouchedFields({});
        }
    }, [open]);


    const generateYears = (startYear, endYear) => {
        const currentYear = new Date().getFullYear();
        startYear = startYear || currentYear - 10;
        endYear = endYear || currentYear + 10;
        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }
        return years;
    };

    const HiddenInput = styled('input')({
        display: 'none',
    });

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{editMode ? 'Edit Nominee' : 'Add Nominee'}</DialogTitle>
            <DialogContent>
                {loading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1,
                        }}
                    >
                        <RoundLoader />
                    </div>
                )}

                {validNomineeInputs.length > 0 && (
                    <div>
                        <TextField
                            select
                            label="Voting Event Name"
                            variant="outlined"
                            fullWidth
                            value={validNomineeInputs[0].event_id}
                            onChange={(e) => handleInputChange(0, e)}
                            name="event_id"
                            margin="normal"
                            error={!!errors.event_id}
                            helperText={errors.event_id}
                        >
                            {votingEvents.map((votingEvent) => (
                                <MenuItem key={votingEvent.id} value={votingEvent.id}>
                                    {votingEvent.event_name_english}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Category"
                            variant="outlined"
                            fullWidth
                            value={validNomineeInputs[0].category_id}
                            onChange={(e) => handleInputChange(0, e)}
                            name="category_id"
                            margin="normal"
                            error={!!errors.category_id}
                            helperText={errors.category_id}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.category_name_english}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                )}

                {validNomineeInputs.map((input, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        {/* Nominee Name (English) */}
                        <TextField
                            label="Nominee Name (English)"
                            variant="outlined"
                            fullWidth
                            value={input.nomineeNameEnglish}
                            onChange={(e) => handleInputChange(index, e)}
                            onBlur={() => handleBlur(index, 'nomineeNameEnglish')}
                            name="nomineeNameEnglish"
                            margin="normal"
                            error={!!errors[index]?.nomineeNameEnglish}
                            helperText={errors[index]?.nomineeNameEnglish}
                        />

                        {/* Nominee Name (Tamil) */}
                        <TextField
                            label="Nominee Name (Tamil)"
                            variant="outlined"
                            fullWidth
                            value={input.nomineeNameTamil}
                            onChange={(e) => handleInputChange(index, e)}
                            name="nomineeNameTamil"
                            margin="normal"
                        />

                        {/* YouTube URL */}
                        <TextField
                            label="YouTube URL"
                            variant="outlined"
                            fullWidth
                            value={input.videoUrl}
                            onChange={(e) => handleInputChange(index, e)}
                            name="videoUrl"
                            margin="normal"
                        />
                        <TextField
                            label="Order"
                            variant="outlined"
                            // fullWidth
                            value={input.order}
                            // onChange={(e) => handleInputChange(index, e)}
                            // onBlur={() => handleBlur(index, 'tamilName')}
                            name="Order"
                            margin="normal"
                            error={!!errors[index]?.order}
                            helperText={errors[index]?.order}
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                                handleInputChange(index, { target: { name: "order", value: numericValue } });
                            }}
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        />

                        {/* Nominee Image */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '20px',
                                marginTop: '10px',
                                padding: '0',
                            }}
                        >
                            <div>
                                <DialogContentText
                                    variant="body2"
                                    style={{ marginBottom: '10px' }}
                                >
                                    Upload Nominee Image
                                </DialogContentText>
                                <label htmlFor={`upload-button-${index}`}>
                                    <HiddenInput
                                        id={`upload-button-${index}`}
                                        type="file"
                                        onChange={(e) => handleImageChange(index, e)}
                                        accept="image/*"
                                    />
                                    <Button
                                        component="span"
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        {input.nomineeImage ? 'Change Image' : 'Upload Image'}
                                    </Button>
                                </label>
                            </div>
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '2px solid #ccc',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                {input.nomineeImagePreview ? (
                                    <img
                                        src={input.nomineeImagePreview}
                                        alt="Preview"
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
                        {errors[index]?.nomineeImage && (
                            <DialogContentText style={{ color: 'red', marginTop: '5px' }}>
                                {errors[index]?.nomineeImage}
                            </DialogContentText>
                        )}

                        {!editMode && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '10px',
                                    marginTop: '15px',
                                    marginBottom: '15px'
                                }}
                            >

                                {validNomineeInputs.length > 1 && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleRemoveNomineeInput(index)}
                                        style={{
                                            minWidth: '30px',
                                            height: '30px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0',
                                            color: theme.palette.error.main
                                        }}
                                    >
                                        <RemoveIcon />
                                    </Button>
                                )}

                                {index === validNomineeInputs.length - 1 && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleAddNomineeInput}
                                        style={{
                                            minWidth: '30px',
                                            height: '30px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0',
                                        }}
                                    >
                                        <AddIcon />
                                    </Button>
                                )}

                            </div>
                        )}
                    </div>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" disabled={!!Object.keys(errors).length}>
                    {editMode ? 'Update' : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NomineeForm;
