import React from 'react'
import {
  Link
} from 'react-router-dom'

import classes from './GradientLink.module.scss'


interface IGradientLink {
  to: string
}

const GradientLink: React.FC<IGradientLink> = ( {
  to,
  children
} ) => {

  return (
    <Link
      className={ classes['gradient-link'] }
      to={ to }
    >
      { children }
    </Link>
  )
}

export default GradientLink
