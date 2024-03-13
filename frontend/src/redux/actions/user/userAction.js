const actionUpdateUser = 'update_user'
const actionClearUser = 'clear_user'

const updateUser = (data) => {
    return {
        type: actionUpdateUser,
        payload: data
    }
}

const clearUser = () => {
    return {
        type: actionClearUser
    }
}

export { actionUpdateUser, actionClearUser, updateUser, clearUser }
