import React, {
  useCallback,
  useRef,
  useEffect
} from 'react'
import { gsap } from 'gsap'

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
}

const Loader: React.FC<ILoaderProps> = ( {
  radius,
  sides,
  depth,
  colors,
  based
} ) => {

  const canvasRef = useRef<HTMLCanvasElement | null>( null )
  const tween = useRef<gsap.core.Tween | null>( null )
  const [ basePoints, getChildrenPoints ] = usePointsInterpolation( { radius, sides, depth } )

  useEffect( () => {
    return () => {
      tween.current?.kill()
    }
  }, [] )

  const canvasRefCallback = useCallback( ( node: HTMLCanvasElement ) => {

    if ( node ) {
      canvasRef.current = node
      const context = node.getContext( '2d' )

      if ( context ) {
        animate( context )
      }
    }
  }, [] )

  const animate = ( context: CanvasRenderingContext2D ) => {

    tween.current = gsap.to( { value: 0 }, {
      value: 1,
      duration: 2,
      repeat: 3,
      ease: 'expo.inOut',
      onUpdate() {

        context.clearRect( 0, 0, canvasRef.current!.width, canvasRef.current!.height )
        context.save()
        context.translate( canvasRef.current!.width / 2, canvasRef.current!.height / 2 )
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
      ref={ canvasRefCallback }
      width={ window.innerWidth }
      height={ window.innerHeight }
      style={ {
        backgroundColor: colors.background,
        position: 'fixed',
        top: 0,
        left: 0
      } }
    />
  )
}

export default Loader
