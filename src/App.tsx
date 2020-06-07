import React, {
  useState,
  useRef
} from 'react'
import { Transition } from 'react-transition-group'
import { gsap } from 'gsap'

import Loader from './components/Loader'


const TRANSITION_DURATION = 1000

const App: React.FC = () => {

  const [isOpen, setIsOpen] = useState<boolean>( false )
  const loaderRef = useRef<HTMLCanvasElement | null>( null )
  const tween = useRef<gsap.core.Tween | null>( null )

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
  }

  return (
    <>
      <button
        type="button"
        onClick={ () => setIsOpen( ( prevIsOpen ) => !prevIsOpen ) }
      >
        { isOpen ? 'Close' : 'Open' }
      </button>
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
    </>
  )
}

export default App
