import React, { useState } from "react"
import * as yup from "yup";
import { Formik, Form } from 'formik';
import { MdPassword } from 'react-icons/md';
import { AiFillMail } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Input from "../../other/Input"
import Spinner from '../../other/Spinner/index';
import { useDispatch } from "react-redux";
import { userSignIn } from "../../../store/Action/authActions"

function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const yupsolver = yup.object({
        password: yup.string().min(8, 'Password must be atleast 8 characters.').required('Password is required.'),
        email: yup.string().email('Email is invalid.').required('Email is required.'),
    })
    const handleLogin = async (data) => {
        setIsLoading(true)
        try {
            const res = await dispatch(userSignIn(data))
            setIsLoading(false)
            if (res.status === 200) {
                toast.success(res.data.message)
                navigate('/dashboard')
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            setIsLoading(false)
            toast.error(e.data.message || "Something went wrong")
        }
    }
    return (
        <div className="loginContainer flex-column justify-content-center p-0 p-lg-3">
            {
                isLoading ? <Spinner /> :
                    (
                        <>
                            <h1 className="pb-3 appTitle">Amazon Ads Management</h1>
                            <ToastContainer />
                            <div className="container formContainer mx-0 mt-5 p-2 p-lg-5 col-10 col-md-10 col-lg-6">
                                <h2 className="loginTitle pb-5">Login</h2>
                                <Formik
                                    initialValues={{ email: '', password: '' }}
                                    validationSchema={yupsolver}
                                    onSubmit={(values) => {
                                        const params = {
                                            email: values.email,
                                            password: values.password
                                        }
                                        handleLogin(params)
                                    }}
                                >
                                    {({
                                        values,
                                        errors,
                                        handleChange,
                                    }) => (
                                        <>
                                            <Form >
                                                <div className="my-3">
                                                    <Input Icon={AiFillMail} handleChange={handleChange} value={values.email} name={'email'} placeholder="Email" type="Email" label="Email*" />
                                                    {errors.email ? <div className='error'>{errors.email}</div> : null}
                                                </div>
                                                <div className="my-3">
                                                    <Input Icon={MdPassword} handleChange={handleChange} value={values.password} name={'password'} placeholder="Password" type="Password" label="Password*" />
                                                    {errors.password ? <div className='error'>{errors.password}</div> : null}
                                                </div>
                                                <div className="row d-flex justify-content-between align">
                                                    <div className="col-12 col-lg-7" onClick={() => { navigate('/signUp') }}>
                                                        <div className='m-0 d-flex  align-items-center' style={{ cursor: 'pointer' }}>
                                                            <p className="p-0 m-0">Don't have account?</p>
                                                            <h6 className='forgot-pass-text px-1 m-0'>Register</h6></div>
                                                    </div>
                                                    <div className="col-12 col-lg-5 d-lg-flex justify-content-end" onClick={() => { navigate('/forgotPassword') }}>
                                                        <p className='m-0 forgot-pass-text' style={{ cursor: 'pointer' }}>Forgot Password ?</p>
                                                    </div>
                                                </div>
                                                <button className='loginBtn px-4 py-3 my-3 w-100' type='submit' onChange={handleChange}>
                                                    Login
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

export default Login