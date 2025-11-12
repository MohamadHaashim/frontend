import * as types from "../Types"
import { API } from "../api"

export const userSignUp = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.signUp,
        method: 'POST',
        data: data,
        success: (data) => ({
            type: types.SIGN_UP_SUCCESS,
            payload: data
        }),
        error: (data) => ({
            type: types.SIGN_UP_ERROR,
            payload: data
        })
    }
})
export const userSignIn = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.SignIn,
        method: 'POST',
        data: data,
        success: (data) => ({
            type: types.SIGN_IN_SUCCESS,
            payload: data
        }),
        error: (data) => ({
            type: types.SIGN_IN_ERROR,
            payload: data
        })
    }
})
export const userforgotPassword = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.forgotPassword,
        method: 'POST',
        data: data,
        success: (data) => ({
            type: types.FORGOT_PASSWORD_SUCCESS,
            payload: data
        }),
        error: (data) => ({
            type: types.FORGOT_PASSWORD_ERROR,
            payload: data
        })
    }
})
export const userOtpVerification = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.otpVerify,
        method: 'POST',
        data: data,
        success: (data) => ({
            type: types.VERIFY_OTP_SUCCESS,
            payload: data
        }),
        error: (data) => ({
            type: types.VERIFY_OTP_ERROR,
            payload: data
        })
    }
})

export const userResetPassword = (data) => ({
    type: types.AMAZON_API,
    payload: {
        url: API.resetPassword,
        method: 'POST',
        data: data,
        success: (data) => ({
            type: types.RESET_PASSWORD_SUCCESS,
            payload: data
        }),
        error: (data) => ({
            type: types.RESET_PASSWORD_ERROR,
            payload: data
        })
    }
})

export const userProfileData = () => ({
    type: types.AMAZON_API,
    payload: {
        url: API.getUserProfile,
        method: 'GET',
        success: (data) => ({
            type: types.GET_PROFILE_SUCCESS,
            payload: data
        }),
        error: (data) => ({
            type: types.GET_PROFILE_ERROR,
            payload: data
        })
    }
})
export const userLogout = () => ({
    type: types.USER_LOGOUT
})


