import React, {
  useState,
  useEffect,
  useRef,
  forwardRef
} from 'react'
import {
  useHistory
} from 'react-router-dom'
import { Transition } from 'react-transition-group'
import { gsap } from 'gsap'

import Loader from '../../components/Loader'


const TRANSITION_DURATION = 1000

const Showroom = forwardRef<HTMLDivElement>( ( props, ref ) => {

  const [isOpen, setIsOpen] = useState<boolean>( true )
  const loaderRef = useRef<HTMLCanvasElement | null>( null )
  const tween = useRef<gsap.core.Tween | null>( null )
  const history = useHistory()

  useEffect( () => {

    const timeoutId = setTimeout( () => {
      setIsOpen( false )
    }, TRANSITION_DURATION * 5 )

    return () => {
      clearTimeout( timeoutId )
    }
  }, [] )

  const handleTransitionEnter = () => {
    tween.current = gsap.from( loaderRef.current, {
      ease: 'power4.out',
      duration: TRANSITION_DURATION / 1000,
      scale: 1.2,
      opacity: 0
    } )
  }

  const handleTransitionExit = () => {
    tween.current = gsap.to( loaderRef.current, {
      ease: 'power4.in',
      duration: TRANSITION_DURATION / 1000,
      scale: 1.2,
      opacity: 0
    } )
  }

  const handleTransitionExited = () => {
    tween.current?.kill()
    tween.current = null
    history.goBack()
  }

  return (
    <div
      ref={ ref }
      className="page"
    >
      <Transition
        nodeRef={ loaderRef }
        in={ isOpen }
        timeout={ TRANSITION_DURATION }
        appear
        mountOnEnter
        unmountOnExit
        onEnter={ handleTransitionEnter }
        onExit={ handleTransitionExit }
        onExited={ handleTransitionExited }
      >
        {
          state => (
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
              based
              transition={ state }
              ref={ loaderRef }
            />
          )
        }
      </Transition>
    </div>
  )
} )

export default Showroom
