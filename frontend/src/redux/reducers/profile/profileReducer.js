import {
    actionGetProfile,
    actionGetProfileSucces,
    actionGetProfileFailure,
    actionUpdateprofile,
    actionClearProfile,
} from '../../actions'

const profileInitialState = {
    isLoading: false,
    data: null,
    error: null
}

const profileReducer = (state = profileInitialState, action) => {
    switch (action.type) {
        case actionGetProfile: return {
            ...state,
            isLoading: true
        }
        case actionGetProfileSucces: return {
            isLoading: false,
            data: action.payload,
            error: null
        }
        case actionGetProfileFailure: return {
            isLoading: false,
            data: null,
            error: action.payload
        }
        case actionUpdateprofile: return {
            isLoading: false,
            data: action.payload,
            error: null
        }
        case actionClearProfile: return {
            isLoading: false,
            data: null,
            error: null
        }
        default: return state
    }
}

export { profileReducer }
