import { actionHandelPreLoader } from '../../actions'

const showPreloader = {
  active: true
}

const preLoaderReducer = (state = showPreloader, action) => {
  switch (action.type) {
    case actionHandelPreLoader: return {
      active: action.payload
    }
    default: return state
  }
}

export { preLoaderReducer }
