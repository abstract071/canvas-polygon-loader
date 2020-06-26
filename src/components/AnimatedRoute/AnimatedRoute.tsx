import React, {
  useRef
} from 'react'
import {
  Route
} from 'react-router-dom'
import {
  Transition
} from 'react-transition-group'
import { gsap } from 'gsap'


interface IAnimatedRoute {
  exact?: boolean
  path: string
  component: React.ForwardRefExoticComponent<any>
  duration: number
}

const AnimatedRoute: React.FC<IAnimatedRoute> = ( {
  exact,
  path,
  component: Component,
  duration
} ) => {

  const componentRef = useRef<HTMLDivElement | null>( null )
  const tween = useRef<gsap.core.Tween | null>( null )

  const handleTransitionEnter = () => {
    tween.current = gsap.from( componentRef.current, {
      ease: 'power4.out',
      duration: duration / 1000,
      scale: 1.2,
      opacity: 0
    } )
  }

  const handleTransitionExit = () => {
    tween.current = gsap.to( componentRef.current, {
      ease: 'power4.out',
      duration: duration / 1000,
      scale: 0.8,
      opacity: 0
    } )
  }

  const handleTransitionExited = () => {
    tween.current?.kill()
    tween.current = null
  }

  return (
    <Route
      exact={ exact }
      path={ path }
      children={
        ( { match } ) => (
          <Transition
            nodeRef={ componentRef }
            in={ match !== null }
            timeout={ duration }
            appear
            mountOnEnter
            unmountOnExit
            onEnter={ handleTransitionEnter }
            onExit={ handleTransitionExit }
            onExited={ handleTransitionExited }
          >
            {
              () => (
                <Component ref={ componentRef }/>
              )
            }
          </Transition>
        )
      }
    />
  )
}

export default AnimatedRoute
