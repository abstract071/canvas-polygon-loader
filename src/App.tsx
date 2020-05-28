import React from 'react'

import Loader from './components/Loader'

import './App.css'


const App = () => {
  return (
    <Loader
      radius={ 150 }
      sides={ 3 }
      depth={ 10 }
      colors={ {
        background: '#f0f0f0',
        stroke: null,
        base: '#222222',
        child: '#f0f0f0'
      } }
      renderBase
    />
  )
}

export default App
