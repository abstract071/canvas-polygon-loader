import React from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'

import AnimatedRoute from './components/AnimatedRoute'

import Home from './pages/Home'
import Showroom from './pages/Showroom'


const App: React.FC = () => {

  return (
    <Router>
      <AnimatedRoute exact path="/" component={ Home } duration={ 1000 } />
      <AnimatedRoute path="/showroom" component={ Showroom } duration={ 1000 } />
    </Router>
  )
}

export default App
