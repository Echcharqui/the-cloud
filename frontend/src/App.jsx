import React from 'react'
import { Provider } from 'react-redux'

import Store from './redux/store'

import Balancer from './components/Balancer/Balancer.jsx'

const App = () => {
  return (
    <Provider store={Store}>
      <Balancer />
    </Provider >
  )
}

export default App