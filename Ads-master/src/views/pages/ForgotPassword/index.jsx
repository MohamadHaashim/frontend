import React, { useState } from 'react';
import Input from "../../other/Input"
import Spinner from '../../other/Spinner';
import * as yup from "yup";
import { Formik, Form } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillMail } from 'react-icons/ai';
import OtpInput from 'react-otp-input';
import Timer from "../../other/Timer"
import { userOtpVerification, userforgotPassword } from "../../../store/Action/authActions"
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ResetPassword from '../ResetPassword';
const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [isotpVerified, setIsOtpVerified] = useState(false)
    const [email, setEmail] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const yupsolver = yup.object({
        email: yup.string().email('Email is invalid.').required('Email is required.'),
    })
    const otpYupsolver = yup.object({
        otp: yup.string().required('OTP is required.'),
    })
    const handleEmailVerify = async (data) => {
        setIsLoading(true)
        try {
            const res = await dispatch(userforgotPassword(data))
            setIsLoading(false)
            if (res.status === 200) {
                toast.success(res.data.message)
                setEmailVerified(true)
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            setIsLoading(false)
        }
    }
    const handleOtpVerify = async (data) => {
        setIsLoading(true)
        try {
            const res = await dispatch(userOtpVerification(data))
            setIsLoading(false)
            if (res.status === 200) {
                toast.success(res.data.message)
                setIsOtpVerified(true)
            } else {
                toast.error(res.data.message)
            }
        } catch (e) {
            setIsLoading(false)
        }
        setEmailVerified(true)
    }
    return (
        <div className="forgotContainer flex-column justify-content-center p-0 p-lg-3">

            <ToastContainer />
            {
                isLoading ? <Spinner /> :
                    isotpVerified ?
                        <ResetPassword setIsLoading={setIsLoading} email={email} /> :
                        emailVerified ? (
                            <>
                                <h1 className="pb-3 appTitle">Amazon Ads Management</h1>
                                <div className="container formContainer mt-5 p-2 p-lg-5 col-10 col-md-10 col-lg-6">
                                    <h1 className="forgotTitle pb-5">Forgot Password</h1>
                                    <Formik
                                        initialValues={{ email: email, otp: '' }}
                                        validationSchema={otpYupsolver}
                                        onSubmit={(values) => {
                                            const params = {
                                                email: values.email,
                                                otpCode: values.otp
                                            }
                                            handleOtpVerify(params)
                                        }}
                                    >
                                        {({
                                            values,
                                            errors,
                                            handleChange,
                                            setFieldValue
                                        }) => (
                                            <>
                                                <Form >
                                                    <div className="mt-3 mb-5">
                                                        <Input handleChange={handleChange} value={values.email} name={'email'} placeholder="Email" type="Email" label="Email*" disabled />
                                                    </div>
                                                    <OtpInput
                                                        value={values.otp}
                                                        onChange={(otp) => setFieldValue('otp', otp)}
                                                        numInputs={6}
                                                        containerStyle={{ width: '100%', justifyContent: 'space-between' }}
                                                        inputStyle={{ minWidth: '25px',width:'50px', height: '50px' }}
                                                        renderInput={(props) => <input {...props} />}
                                                    />
                                                    {errors.otp ? <div className='error'>{errors.otp}</div> : null}
                                                    <p className=' pt-4'>Verification code send to your E-mail. <b>It will exipre in <Timer setIsExpire={setEmailVerified} delayResend="180" /></b></p>
                                                    <button className='forgotBtn px-4 py-3 my-3  w-100' type='submit' onChange={handleChange}>
                                                        Verify
                                                    </button>
                                                </Form>
                                            </>
                                        )}
                                    </Formik>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="pb-3 appTitle">Amazon Ads Management</h1>
                                <div className="container formContainer mt-5 p-2 p-lg-5 col-10 col-md-10 col-lg-6">
                                    <h1 className="forgotTitle pb-5">Forgot Password</h1>
                                    <Formik
                                        initialValues={{ email: '' }}
                                        validationSchema={yupsolver}
                                        onSubmit={(values) => {
                                            setEmail(values.email)
                                            const params = {
                                                email: values.email,
                                            }
                                            handleEmailVerify(params)
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
                                                    <button className='forgotBtn px-4 py-3 my-3 w-100' type='submit' onChange={handleChange}>
                                                        Submit
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
    );
}

export default ForgotPassword;