import React, { useState } from "react"
import * as yup from "yup";
import { Formik, Form } from 'formik';
import { MdPassword } from 'react-icons/md';
import { AiFillMail } from 'react-icons/ai';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Input from "../../other/Input"
import { useDispatch } from "react-redux";
import { userResetPassword } from "../../../store/Action/authActions"

function ResetPassword(props) {
    const {setIsLoading, email} = props
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const yupsolver = yup.object({
        email: yup.string().email('Email is invalid.').required('Email is required.'),
        password: yup.string().required('Password is required.').matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Password must contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
        ),
        cpassword: yup.string().required('Confirm Password is required.').oneOf([yup.ref('password'), null], 'Password and Confirm Password must match.')
    })
    const handleReset = async (data) => {
        setIsLoading(true)
        try {
            const res = await dispatch(userResetPassword(data))
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
        <div className="container formContainer mt-5 p-2 p-lg-5 col-5">
            <h1 className="resetTitle pb-5">Reset Password</h1>
            <Formik
                initialValues={{ email: email, password: '', cpassword: '' }}
                validationSchema={yupsolver}
                onSubmit={(values) => {
                    const params = {
                        email: values.email,
                        password: values.password
                    }
                    handleReset(params)
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
                                <Input Icon={AiFillMail} handleChange={handleChange} value={values.email} name={'email'} placeholder="Email" type="Email" label="Email*" disabled/>
                            </div>
                            <div className="my-3">
                                <Input Icon={MdPassword} handleChange={handleChange} value={values.password} name={'password'} placeholder="Password" type="Password" label="Password*" />
                                {errors.password ? <div className='error'>{errors.password}</div> : null}
                            </div>
                            <div className="my-3">
                                <Input Icon={MdPassword} handleChange={handleChange} value={values.cpassword} name={'cpassword'} placeholder="Confirm Password" type="Password" label="Confirm Password*" />
                                {errors.cpassword ? <div className='error'>{errors.cpassword}</div> : null}
                            </div>
                            <button className='resetBtn px-4 py-3 my-3 w-100' type='submit' onChange={handleChange}>
                                Submit
                            </button>
                        </Form>
                    </>
                )}
            </Formik>
        </div>
    )
}

export default ResetPassword