import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, useTheme } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import noImage from '../../assets/images/images/noimage.jpg'
import RoundLoader from '../../ui-component/extended/Loader/RoundLoader';

const EventForm = ({
    open,
    onClose,
    categoryInputs,
    onSave,
    onCategoryInputChange,
    onImageChange,
    editMode,
    handleAddCategoryInput,
    handleRemoveCategoryInput,
    loading
}) => {
    const [errors, setErrors] = useState([]);
    const [touchedFields, setTouchedFields] = useState({});

    const validCategoryInputs = categoryInputs && categoryInputs.length > 0 ? categoryInputs : [{
        englishName: '',
        tamilName: '',
        image: '',
        file: null,
    }];

    const theme = useTheme();

    useEffect(() => {
        if (!open) {
            setErrors([]);
            setTouchedFields({});
        }
    }, [open]);


    const HiddenInput = styled('input')({
        display: 'none',
    });

    const handleBlur = (index, fieldName) => {
        setTouchedFields((prev) => ({
            ...prev,
            [`${index}_${fieldName}`]: true,
        }));
    };


    // Validation function to check inputs
    const handleValidation = (isSubmitting = false) => {
        const newErrors = [];

        validCategoryInputs.forEach((input, index) => {
            const fieldErrors = {};

            if ((isSubmitting || touchedFields[`${index}_englishName`]) && !input.englishName) {
                fieldErrors.englishName = 'Event Name (English) is required';
            }

            // if ((isSubmitting || touchedFields[`${index}_image`]) && !input.image && !input.file) {
            //     fieldErrors.image = 'Category image is required';
            // }

            if (Object.keys(fieldErrors).length > 0) {
                newErrors[index] = fieldErrors;
            }
        });

        setErrors(newErrors);
        return newErrors.length === 0; 
    };


    const handleInputChange = (index, e) => {
        onCategoryInputChange(index, e);
        handleValidation();
    };


    const handleImageChange = (index, e) => {
        onImageChange(index, e)
        handleValidation();
    };

    const handleSave = () => {
        const isValid = handleValidation(true);
        if (isValid) {
            onSave();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{editMode ? 'Edit Event' : 'Add Event'}</DialogTitle>
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
                {validCategoryInputs.map((input, index) => (
                    <div key={index}>
                        <TextField
                            label="Event Name (English)"
                            variant="outlined"
                            fullWidth
                            value={input.englishName}
                            onChange={(e) => handleInputChange(index, e)}
                            onBlur={() => handleBlur(index, 'englishName')}
                            name="englishName"
                            margin="normal"
                            error={!!errors[index]?.englishName}
                            helperText={errors[index]?.englishName}
                        />

                        <TextField
                            label="Event Name (Tamil)"
                            variant="outlined"
                            fullWidth
                            value={input.tamilName}
                            onChange={(e) => handleInputChange(index, e)}
                            onBlur={() => handleBlur(index, 'tamilName')}
                            name="tamilName"
                            margin="normal"
                            error={!!errors[index]?.tamilName}
                            helperText={errors[index]?.tamilName}
                        />
                        
                        {/* Remove and Add Buttons */}
                        {!editMode && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px', marginBottom: '15px', padding: 0 }}>
                                {categoryInputs.length > 1 && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => handleRemoveCategoryInput(index)}
                                        style={{
                                            minWidth: '30px',
                                            height: '30px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0',
                                            color: theme.palette.error.main,
                                            borderColor: theme.palette.error.main,
                                        }}
                                    >
                                        <RemoveIcon />
                                    </Button>
                                )}
                                {index === validCategoryInputs.length - 1 && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleAddCategoryInput}
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
                <Button onClick={handleSave} color="primary" disabled={!!errors.length}>
                    {editMode ? 'Update' : 'Submit'}

                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EventForm;
