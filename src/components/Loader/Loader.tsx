import React, {
  useRef,
  useEffect,
  forwardRef,
  MutableRefObject
} from 'react'
import { gsap } from 'gsap'
import { TransitionStatus } from 'react-transition-group/Transition'

import { usePointsInterpolation } from '../../hooks'


interface IPoint {
  x: number
  y: number
}

interface ILoaderProps {
  radius: number
  sides: number
  depth: number
  colors: {
    background: string
    stroke: string | null
    base: string
    child: string
  }
  based?: boolean
  transition: TransitionStatus
}

const Loader = forwardRef<HTMLCanvasElement, ILoaderProps>( ( {
  radius,
  sides,
  depth,
  colors,
  based,
  transition
}, ref ) => {

  const tween = useRef<gsap.core.Tween | null>( null )
  const [ basePoints, getChildrenPoints ] = usePointsInterpolation( { radius, sides, depth } )

  useEffect( () => {

    if ( transition === 'entering' ) {
      const context = ( ref as MutableRefObject<HTMLCanvasElement> ).current.getContext( '2d' )

      if ( context ) {
        animate( context )
      }
    }
  }, [ ref, transition ] )

  useEffect( () => {

    return () => {
      tween.current?.kill()
    }
  }, [] )

  const animate = ( context: CanvasRenderingContext2D ) => {

    tween.current = gsap.to( { value: 0 }, {
      value: 1,
      duration: 2,
      repeat: -1,
      ease: 'expo.inOut',
      onUpdate() {

        const canvas = ( ref as MutableRefObject<HTMLCanvasElement> ).current

        context.clearRect( 0, 0, canvas.width, canvas.height )
        context.save()
        context.translate( canvas.width / 2, canvas.height / 2 )
        context.lineWidth = 1.5


        if ( based ) {
          renderBase( context )
        }

        const children = getChildrenPoints( this.ratio )

        renderChildren( context, children )

        context.restore()
      }
    } )
  }

  const renderBase = ( context: CanvasRenderingContext2D ) => {

    const { base } = colors

    // Draw basePolygon.
    drawOutline( context, basePoints )

    if ( base ) {
      context.fillStyle = base
      context.fill()
    }
  }

  const renderChildren = ( context: CanvasRenderingContext2D, children: IPoint[][] ) => {

    const { child } = colors

    children.forEach( ( points, idx ) => {

      // Draw child.
      drawOutline( context, points )

      if ( child ) {
        const [r, g, b] = gsap.utils.splitColor( child )

        let alphaUnit = 1 / children.length
        let alpha = alphaUnit + ( alphaUnit * idx )

        context.fillStyle = `rgba(${ r }, ${ g }, ${ b }, ${ alpha })`

        // Set Shadow.
        context.shadowColor = 'rgba(0,0,0, 0.1)'
        context.shadowBlur = 10
        context.shadowOffsetX = 0
        context.shadowOffsetY = 0

        context.fill()
      }
    } )
  }

  const drawOutline = ( context: CanvasRenderingContext2D, points: IPoint[] ) => {

    const { stroke } = colors

    context.beginPath()
    points.forEach( ( point: IPoint ) => context.lineTo( point.x, point.y ) )
    context.closePath()

    if ( stroke ) {
      context.strokeStyle = stroke
      context.stroke()
    }
  }

  return (
    <canvas
      ref={ ref }
      width={ window.innerWidth }
      height={ window.innerHeight }
      style={ {
        backgroundColor: colors.background,
        position: 'fixed',
        top: 0,
        left: 0,
        marginTop: 30
      } }
    />
  )
} )

export default Loader
