const actionHandelPreLoader = 'handel_preLoader'

const handelPreLoader = (data) => {
  return {
    type: actionHandelPreLoader,
    payload: data
  }
}

export { actionHandelPreLoader, handelPreLoader }
