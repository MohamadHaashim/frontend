import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, useTheme,MenuItem} from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import noImage from '../../assets/images/images/noimage.jpg'
import RoundLoader from '../../ui-component/extended/Loader/RoundLoader';

const CategoryForm = ({
    open,
    onClose,
    categoryInputs,
    onSave,
    onCategoryInputChange,
    onImageChange,
    editMode,
    handleAddCategoryInput,
    handleRemoveCategoryInput,
    votingEvents,
    loading
}) => {
    const [errors, setErrors] = useState([]);
    const [touchedFields, setTouchedFields] = useState({});
    const validCategoryInputs = categoryInputs && categoryInputs.length > 0 ? categoryInputs : [{
        englishName: '',
        tamilName: '',
        image: '',
        event_id:'',
        order:'',
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
        const newErrors = {};

        if ((isSubmitting || touchedFields[`0_event_id`]) && !validCategoryInputs[0].event_id) {
            newErrors.event_id = 'Event is required';
        }
        
        validCategoryInputs.forEach((input, index) => {
            const fieldErrors = {};

            if ((isSubmitting || touchedFields[`${index}_englishName`]) && !input.englishName) {
                // fieldErrors.englishName = 'Category Name (English) is required';
                fieldErrors.englishName = 'Category Name (English) is required';
            }

            // if ((isSubmitting || touchedFields[`${index}_image`]) && !input.image && !input.file) {
            //     fieldErrors.image = 'Category image is required';
            // }

            if (Object.keys(fieldErrors).length > 0) {
                newErrors[index] = fieldErrors;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            <DialogTitle>{editMode ? 'Edit Category' : 'Add Category'}</DialogTitle>
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
               
                    {validCategoryInputs.length > 0 && (
                     <TextField
                        select
                        label="Voting Event Name"
                        variant="outlined"
                        fullWidth
                        value={validCategoryInputs[0].event_id}
                        onChange={(e) => handleInputChange(0, e)}
                        name="event_id" // Ensure consistency with input state
                        margin="normal"
                        error={!!errors?.event_id}
                        helperText={errors?.event_id}
                    >
                        {votingEvents.map((votingEvent) => (
                            <MenuItem key={votingEvent.id} value={votingEvent.id}>
                                {votingEvent.event_name_english}
                            </MenuItem>
                        ))}
                    </TextField>
                    )}
                     {validCategoryInputs.map((input, index) => (
                   
                   <div key={index}>
                        <TextField
                            label="Category Name (English)"
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
                            label="Category Name (Tamil)"
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
                        <TextField
                            label="Order"
                            variant="outlined"
                            // fullWidth
                            value={input.order}
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                                handleInputChange(index, { target: { name: "order", value: numericValue } });
                            }}
                            onBlur={() => handleBlur(index, 'Order')}
                            name="Order"
                            margin="normal"
                            error={!!errors[index]?.order}
                            helperText={errors[index]?.order}
                           
                            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        />
                       
                        {/* Category Image */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginTop: '10px', padding: 0 }}>
                            <div>
                                <DialogContentText variant="body2" style={{ marginBottom: '10px' }}>
                                    Upload Category Image
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
                                        {input.image ? 'Change Image' : 'Upload Image'}
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
                                {input.image || input.file ? (
                                    <img
                                        src={input.image || URL.createObjectURL(input.file)}
                                        alt="Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                        onError={(e) => e.target.src = noImage}
                                    />
                                ) : (
                                    <span style={{ color: '#aaa', fontSize: '14px', textAlign: 'center' }}>
                                        No Image Uploaded
                                    </span>
                                )}
                            </div>
                        </div>
                        {errors[index]?.image && (
                            <DialogContentText style={{ color: 'red', marginTop: '5px' }}>
                                {errors[index]?.image}
                            </DialogContentText>
                        )}

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
                                {index === validCategoryInputs.length > 1 && (
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

export default CategoryForm;
