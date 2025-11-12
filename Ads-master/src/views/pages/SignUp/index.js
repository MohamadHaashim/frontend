import React, { useState } from "react"
import * as yup from "yup";
import { Formik, Form } from 'formik';
import { MdPassword } from 'react-icons/md';
import { AiFillMail, AiFillPhone } from 'react-icons/ai';
import { FaUserEdit } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Input from "../../other/Input"
import Spinner from '../../other/Spinner';
import { userSignUp } from "../../../store/Action/authActions"
import { useDispatch } from "react-redux";
function SignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const yupsolver = yup.object({
        name: yup.string().min(3, 'Name must be atleast 3 characters.').required('Name is required.'),
        password: yup.string().required('Password is required.').matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Password must contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
        ),
        phone: yup.string().min(10, "Contact Number must contain minimum 10 digits.").max(10, "Contact Number must contain maximum 10 digits.").required('Contact Number is required.'),
        email: yup.string().email('Email is invalid.').required('Email is required.'),
        cpassword: yup.string().required('Confirm Password is required.').oneOf([yup.ref('password'), null], 'Password and Confirm Password must match.')
    })
    const handleSignUp = async (data) => {
        setIsLoading(true)
        try {
            const res = await dispatch(userSignUp(data))
            setIsLoading(false)
            if (res.status === 200) {
                toast.success(res.data.message)
                navigate('/')
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            setIsLoading(false)
            toast.error(e.data.message || "Something went wrong")
        }
    }
    return (
        <div className="signUpContainer flex-column justify-content-center p-0 p-lg-3">
            <ToastContainer />
            {
                isLoading ? <Spinner /> :
                    (
                        <>
                            <h1 className="pb-3 appTitle">Amazon Ads Management</h1>
                            <div className="container formContainer  mt-5 p-2 p-lg-5 col-10 col-md-10 col-lg-6">
                                <h1 className="signUpTitle pb-5">Create Account</h1>
                                <Formik
                                    initialValues={{ name: '', email: '', password: '', cpassword: '', phone: '' }}
                                    validationSchema={yupsolver}
                                    onSubmit={(values) => {
                                        const params = {
                                            fullName: values.name,
                                            email: values.email,
                                            password: values.password,
                                            phoneNumber: values.phone
                                        }
                                        handleSignUp(params)
                                    }}
                                >
                                    {({
                                        values,
                                        errors,
                                        handleChange,
                                    }) => (
                                        <>
                                            <Form >
                                                <div className="my-2">
                                                    <Input Icon={FaUserEdit} handleChange={handleChange} value={values.name} name={'name'} placeholder="name" type="text" label="Name*" />
                                                    {errors.name ? <div className='error'>{errors.name}</div> : null}
                                                </div>
                                                <div className="my-2">
                                                    <Input Icon={AiFillMail} handleChange={handleChange} value={values.email} name={'email'} placeholder="Email" type="Email" label="Email*" />
                                                    {errors.email ? <div className='error'>{errors.email}</div> : null}
                                                </div>
                                                <div className="my-2">
                                                    <Input Icon={AiFillPhone} handleChange={handleChange} value={values.phone} name={'phone'} placeholder="Contact Numer" type="number" label="Contact Numer*" />
                                                    {errors.phone ? <div className='error'>{errors.phone}</div> : null}
                                                </div>
                                                <div className="my-2">
                                                    <Input Icon={MdPassword} handleChange={handleChange} value={values.password} name={'password'} placeholder="Password" type="Password" label="Password*" />
                                                    {errors.password ? <div className='error'>{errors.password}</div> : null}
                                                </div>
                                                <div className="my-2">
                                                    <Input Icon={MdPassword} handleChange={handleChange} value={values.cpassword} name={'cpassword'} placeholder="Confirm Password" type="Password" label="Confirm Password*" />
                                                    {errors.cpassword ? <div className='error'>{errors.cpassword}</div> : null}
                                                </div>
                                                <div className="row d-flex justify-content-between align">
                                                    <div className="col-12" onClick={() => { navigate('/') }}>
                                                        <div className='m-0 d-flex  align-items-center' style={{ cursor: 'pointer' }}>
                                                            <p className="p-0 m-0">Already have account?</p>
                                                            <h6 className='forgot-pass-text px-1 m-0'>Login</h6></div>
                                                    </div>
                                                </div>
                                                <button className='signUpBtn px-4 py-3 my-3 w-100' type='submit' onChange={handleChange}>
                                                    Register
                                                </button>
                                            </Form>
                                        </>
                                    )}
                                </Formik>
                            </div>
                        </>
                    )
            }
        </div>
    )
}

export default SignUp