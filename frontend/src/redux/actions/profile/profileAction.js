import { axiosInstance } from '../../../utility'
import { API } from '../../../config/config'

const actionGetProfile = 'get_profile'
const actionGetProfileSucces = 'get_profile_succes'
const actionGetProfileFailure = 'get_profile_failure'
const actionUpdateprofile = 'update_profile'
const actionClearProfile = 'clear_profile'

const getProfile = () => {
    return {
        type: actionGetProfile
    }
}

const getProfileSucces = (profile) => {

    return {
        type: actionGetProfileSucces,
        payload: profile
    }
}

const getProfileFailure = (error) => {
    return {
        type: actionGetProfileFailure,
        payload: error

    }
}

const updateProfile = (data) => {
    return {
        type: actionUpdateprofile,
        payload: data
    }
}

const clearProfile = () => {
    return {
        type: actionClearProfile
    }
}

const fetchProfile = () => {

    return (dispatch) => {

        dispatch(getProfile())

        axiosInstance.get(`${API}/profile/v3/my-profile`)
            .then(response => {
                dispatch(getProfileSucces(response.data))
            })
            .catch(function (error) {
                dispatch(getProfileFailure(error.response.data.message))
            })
    }
}

export { actionGetProfile, actionGetProfileSucces, actionGetProfileFailure, actionUpdateprofile, actionClearProfile, getProfile, getProfileSucces, getProfileFailure, fetchProfile, updateProfile, clearProfile }
