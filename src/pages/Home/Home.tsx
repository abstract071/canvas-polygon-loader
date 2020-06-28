import React, {
  forwardRef
} from 'react'

import GradientLink from '../../components/GradientLink'


const Home = forwardRef<HTMLDivElement>( ( props, ref ) => {

  return (
    <div
      ref={ ref }
      className="page"
    >
      <GradientLink to="/showroom">
        Run Loader
      </GradientLink>
    </div>
  )
} )

export default Home
