import { useRef } from 'react'
import { gsap } from 'gsap'


interface IPoint {
  x: number
  y: number
}

interface IUsePointsInterpolationParams {
  radius: number
  sides: number
  depth: number
}

const usePointsInterpolation = ( {
  radius,
  sides,
  depth
}: IUsePointsInterpolationParams ): [ IPoint[], ( progress: number ) => IPoint[][] ] => {
  const points = useRef<IPoint[]>( [] )

  const getRegularPolygonPoints = (): IPoint[] => {

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

  const getInscribedPoints = ( points: IPoint[], progress: number ): IPoint[] => {

    let inscribedPoints: IPoint[] = []

    for ( let i = 0; i < points.length; i++ ) {

      let start = points[i]
      let end = points[i + 1] || points[0]
      let point = gsap.utils.interpolate( start, end, progress )

      inscribedPoints.push( point )
    }

    return inscribedPoints
  }

  const getChildrenPoints = ( progress: number ): IPoint[][] => {

    let children = []

    for ( let i = 0; i < depth; i++ ) {

      // Get basePolygon points on first lap
      // then get previous child points.
      let inscribedPoints = getInscribedPoints( children[i - 1] || points.current, progress )

      children.push( inscribedPoints )
    }

    return children
  }

  points.current = getRegularPolygonPoints()

  return [ points.current, getChildrenPoints ]
}

export default usePointsInterpolation
