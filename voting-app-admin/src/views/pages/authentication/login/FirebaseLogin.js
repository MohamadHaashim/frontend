import React from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    makeStyles,
    OutlinedInput,
    Typography,
    TextField
} from '@material-ui/core';
import { Link } from 'react-router-dom';

import useScriptRef from '../../../../hooks/useScriptRef';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Google from './../../../../assets/images/icons/social-google.svg';
import { Login } from "../../../../services/authendication";
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {},
    redButton: {
        fontSize: '1rem',
        fontWeight: 500,
        backgroundColor: theme.palette.grey[50],
        border: '1px solid',
        borderColor: theme.palette.grey[100],
        color: theme.palette.grey[600],
        textTransform: 'none',
        '&:hover': {
            backgroundColor: theme.palette.primary.light
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.875rem'
        }
    },
    signDivider: {
        flexGrow: 1
    },
    signText: {
        cursor: 'unset',
        margin: theme.spacing(2),
        padding: '5px 56px',
        borderColor: theme.palette.grey[100] + ' !important',
        color: theme.palette.grey[900] + '!important',
        fontWeight: 500
    },
    margin: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1)
    },
    forgot: {
        textDecoration: 'none',
        color: theme.palette.purple.main
    },
    loginIcon: {
        marginRight: '16px',
        [theme.breakpoints.down('sm')]: {
            marginRight: '8px'
        }
    },
    title: {
        color: theme.palette.grey[600]
    },
    login: {
        backgroundColor: theme.palette.purple.main,
        '&:hover': {
            backgroundColor: theme.palette.purple.dark
        }
    },
    loginput: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        '& > label': {
            top: '23px',
            left: 0,
            color: theme.palette.grey[500],
            '&[data-shrink="false"]': {
                top: '5px'
            }
        },
        '& > div > input': {
            padding: '30.5px 14px 11.5px !important'
        },
        '& legend': {
            display: 'none'
        },
        '& fieldset': {
            top: 0
        }
    },
    startAdornment: {
        color: theme.palette.grey[500],
        marginTop: '18px',
        width: 'auto'
    }
}));

const FirebaseLogin = (props, { className, ...rest }) => {
    const classes = useStyles();
    const customization = useSelector((state) => state.customization);
    const scriptedRef = useScriptRef();
    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();

    const googleHandler = async () => {

    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickVariant = (variant, message) => {
        console.log("this si calling")
        enqueueSnackbar(message, { variant });
    };
    
    
    const loginFunction = async (values) => {
        try {
            const { email, password } = values;
            const responseData = await Login(email, password);
            console.log("responsedata", responseData);
            if (responseData.code === "200") {
                console.log("comes inside 200");
                localStorage.setItem("token", responseData.responseData.token);
                localStorage.setItem("name", responseData.responseData.userDetail.name);

                history.push('/dashboard');
                handleClickVariant('success', responseData.message);
            } else {
                console.log("comes to the else part");
                handleClickVariant('error', responseData.message);
            }
        } catch (error) {
            console.log("error:", error);
            handleClickVariant('error', 'An error occurred.');
        }
    };
    
    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        await loginFunction(values);
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
                        <TextField
                            label="Email Address / Username"
                            variant="outlined"
                            fullWidth
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                            margin="normal"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
    
                        {errors.submit && (
                            <Box mt={3}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
    
                        <Box mt={2}>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                className={classes.login}
                            >
                                Sign in
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </React.Fragment>
    );
    
};

export default FirebaseLogin;
