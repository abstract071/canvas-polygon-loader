import React, { useCallback, useRef } from 'react'
import { gsap } from 'gsap'


interface IPoint {
  x: number
  y: number
}

interface LoaderPropsType {
  radius: number
  sides: number
  depth: number
  colors: {
    background: string
    stroke: string | null
    base: string
    child: string
  }
  renderBase?: boolean
}

const Loader: React.FC<LoaderPropsType> = ( {
  radius,
  sides,
  depth,
  colors,
  renderBase
}: LoaderPropsType ) => {
  const canvasRef = useRef<HTMLCanvasElement | null>( null )
  const points = useRef<IPoint[]>( [] )

  const canvasRefCallback = useCallback( ( node: HTMLCanvasElement ) => {

    if ( node ) {
      canvasRef.current = node
      const context = node.getContext( '2d' )
      points.current = getRegularPolygonPoints()

      if ( context ) {
        animate( context )
      }
    }
  }, [] )

  const animate = ( context: CanvasRenderingContext2D ) => {

    gsap.to( { value: 0 }, {
      value: 1,
      duration: 2,
      repeat: 3,
      ease: 'expo.inOut',
      onUpdate() {

        context.clearRect( 0, 0, canvasRef.current!.width, canvasRef.current!.height )
        context.save()
        context.translate( canvasRef.current!.width / 2, canvasRef.current!.height / 2 )
        context.lineWidth = 1.5


        if ( renderBase ) {
          render( context )
        }


        const children = getUpdatedChildren( this.ratio )

        children.forEach( ( points, idx ) => {

          // Draw child.
          context.beginPath()
          points.forEach( ( point: IPoint ) => context.lineTo( point.x, point.y ) )
          context.closePath()


          // Set colors.
          let strokeColor = colors.stroke
          let childColor = colors.child

          if ( strokeColor ) {
            context.strokeStyle = strokeColor
            context.stroke()
          }

          if ( childColor ) {
            const [r, g, b] = gsap.utils.splitColor( childColor )

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

        context.restore()
      }
    } )
  }

  const render = ( context: CanvasRenderingContext2D ) => {

    // Draw basePolygon.
    context.beginPath()
    points.current.forEach( ( point: IPoint ) => context.lineTo( point.x, point.y ) )
    context.closePath()

    // Set colors.
    let strokeColor = colors.stroke
    let childColor = colors.base

    if ( strokeColor ) {
      context.strokeStyle = strokeColor
      context.stroke()
    }

    if ( childColor ) {
      context.fillStyle = childColor
      context.fill()
    }
  }

  const getRegularPolygonPoints = () => {

    let points = []

    for ( let i = 0; i < sides; i++ ) {

      // Note that sin and cos are inverted in order to draw
      // polygon pointing down like: ∇
      let x = -radius * Math.sin( i * 2 * Math.PI / sides )
      let y = radius * Math.cos( i * 2 * Math.PI / sides )

      points.push( { x, y } )
    }

    return points
  }


  const getInscribedPoints = ( points: IPoint[], progress: number ) => {

    let inscribedPoints: IPoint[] = []

    for ( let i = 0; i < points.length; i++ ) {

      let start = points[i]
      let end = points[i + 1] || points[0]
      let point = gsap.utils.interpolate( start, end, progress )

      inscribedPoints.push( point )
    }

    return inscribedPoints
  }

  const getUpdatedChildren = ( progress: number ) => {

    let children = []

    for ( let i = 0; i < depth; i++ ) {

      // Get basePolygon points on first lap
      // then get previous child points.
      let inscribedPoints = getInscribedPoints( children[i - 1] || points.current, progress )

      children.push( inscribedPoints )
    }

    return children
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
