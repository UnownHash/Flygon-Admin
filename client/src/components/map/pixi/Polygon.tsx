import { LatLngTuple } from 'leaflet'
import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'

import { usePixiContext } from './PixiContext'

interface PolygonInterface {
  positions: LatLngTuple[]
  pathOptions: {
    color: string
    fillColor?: string | undefined
    fillOpacity?: number | undefined
    opacity?: number | undefined
    weight?: number | undefined
  }
}

export const Polygon = ({ positions, pathOptions }: PolygonInterface) => {
  const {
    color,
    fillColor = color,
    fillOpacity = 0.5,
    opacity = 1,
    weight = 3,
  } = pathOptions
  const { pixiOverlay, render } = usePixiContext()
  const polygonRef = useRef<PIXI.Graphics>()

  useEffect(() => {
    if (!pixiOverlay || !render) {
      return
    }

    const { utils } = pixiOverlay
    const container = utils.getContainer()
    const project = utils.latLngToLayerPoint
    const scale = utils.getScale()

    const polygon = polygonRef.current || new PIXI.Graphics()

    if (polygonRef.current !== undefined) {
      polygonRef.current.clear()
    }

    polygon.lineStyle(weight / scale, PIXI.utils.string2hex(color), opacity)
    polygon.beginFill(PIXI.utils.string2hex(fillColor), fillOpacity)
    positions.forEach((coords, index) => {
      const projectedCoords = project(coords)

      if (index == 0) {
        polygon.moveTo(projectedCoords.x, projectedCoords.y)
      } else {
        polygon.lineTo(projectedCoords.x, projectedCoords.y)
      }
    })
    polygon.lineTo(project(positions[0]).x, project(positions[0]).y)
    polygon.endFill()

    if (!polygonRef.current) {
      polygonRef.current = container.addChild(polygon)
    }

    render()

    return () => {
      if (polygonRef.current) {
        pixiOverlay?.utils.getContainer().removeChild(polygonRef.current)
        polygonRef.current.clear()
        polygonRef.current = undefined
        render()
      }
    }
  }, [pixiOverlay, render, positions, pathOptions])

  return null
}
