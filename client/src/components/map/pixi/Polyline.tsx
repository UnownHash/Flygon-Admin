import { LatLngTuple } from 'leaflet'

import { usePixiContext } from './PixiContext'
import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'

interface PolylineInterface {
  positions: LatLngTuple[]
  pathOptions: {
    color: string
    opacity?: number | undefined
    weight?: number | undefined
  }
}

export const Polyline = ({ positions, pathOptions }: PolylineInterface) => {
  const { color, opacity = 1, weight = 3 } = pathOptions
  const { pixiOverlay, render } = usePixiContext()
  const polylineRef = useRef<PIXI.Graphics>()

  useEffect(() => {
    if (!pixiOverlay || !render) {
      return
    }

    const { utils } = pixiOverlay
    const container = utils.getContainer()
    const project = utils.latLngToLayerPoint
    const scale = utils.getScale()

    const polyline = polylineRef.current || new PIXI.Graphics()

    if (polylineRef.current !== undefined) {
      polylineRef.current.clear()
    }

    polyline.lineStyle(weight / scale, PIXI.utils.string2hex(color), opacity)
    positions.forEach((coords, index) => {
      const projectedCoords = project(coords)

      if (index === 0) {
        polyline.moveTo(projectedCoords.x, projectedCoords.y)
      } else {
        polyline.lineTo(projectedCoords.x, projectedCoords.y)
      }
    })
    polyline.endFill()

    if (!polylineRef.current) {
      polylineRef.current = container.addChild(polyline)
    }

    render()

    return () => {
      if (polylineRef.current) {
        pixiOverlay?.utils.getContainer().removeChild(polylineRef.current)
        polylineRef.current.clear()
        polylineRef.current = undefined
      }
    }
  }, [pixiOverlay, render, positions, pathOptions])

  return null
}
