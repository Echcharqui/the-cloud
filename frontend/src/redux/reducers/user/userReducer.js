import {
    actionUpdateUser,
    actionClearUser
} from '../../actions'

const userInitialState = {
    data: null
}

const userReducer = (state = userInitialState, action) => {
    switch (action.type) {
        case actionUpdateUser: return {
            data: action.payload,
        }
        case actionClearUser: return {
            data: null,
        }
        default: return state
    }
}

export { userReducer }
