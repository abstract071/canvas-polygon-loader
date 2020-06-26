import React, {
  forwardRef
} from 'react'
import {
  Link
} from 'react-router-dom'


const Home = forwardRef<HTMLDivElement>( ( props, ref ) => {

  return (
    <div
      ref={ ref }
      className="page"
    >
      <Link to="/showroom">
        Open
      </Link>
    </div>
  )
} )

export default Home
