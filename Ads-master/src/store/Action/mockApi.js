import * as TYPE from "../Types"

export const FetchRequested = props => ({
    type: TYPE.API_REQUEST,
    ...props
})

export const FetchSucceeded = data => ({
    type: TYPE.API_SUCCESS,
    payload: { data }
})

export const FetchFailed = err => ({
    type: TYPE.API_ERROR,
    payload: { err }
})

