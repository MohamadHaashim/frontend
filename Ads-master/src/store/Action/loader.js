import * as types from "../Types"

export const handleLoader = (data) => ({
    type: types.GET_LOADER,
    payload: {
        data: data
    }
})



export const handleLoader1 = value => dispatch => dispatch({ type: 'GET_LOADER1', value })