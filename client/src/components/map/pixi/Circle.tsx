import { LatLngTuple } from 'leaflet';

import { usePixiContext } from './PixiContext';
import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface CircleInterface {
  center: LatLngTuple;
  radius: number;
  pathOptions: {
    color: string;
    fillColor?: string | undefined;
    fillOpacity?: number | undefined;
    opacity?: number | undefined;
    weight?: number | undefined;
  };
}

const earthRadius = 6378.137;
const oneMeter = 1 / (((2 * Math.PI) / 360) * earthRadius) / 1000;

export const Circle = ({ center, radius, pathOptions }: CircleInterface) => {
  const { color, fillColor = color, fillOpacity = 0.2, opacity = 1, weight = 15 } = pathOptions;
  const { pixiOverlay, render } = usePixiContext();
  const circleRef = useRef<PIXI.Graphics>();

  useEffect(() => {
    if (!pixiOverlay || !render) {
      return;
    }

    const { utils } = pixiOverlay;
    const container = utils.getContainer();
    const project = utils.latLngToLayerPoint;
    const scale = utils.getScale();

    const circle = circleRef.current || new PIXI.Graphics();

    if (circleRef.current !== undefined) {
      circleRef.current.clear();
    }

    const projectedCenter = project(center);
    const projectedPoint = project([center[0] + radius * oneMeter, center[1]]);
    const circleRadius = Math.abs(projectedCenter.y - projectedPoint.y);
    const scaleFactor = 10;

    circle.scale.set(1 / scaleFactor);
    circle.lineStyle(weight / scale, PIXI.utils.string2hex(color), opacity);
    circle.beginFill(PIXI.utils.string2hex(fillColor), fillOpacity);
    circle.x = projectedCenter.x;
    circle.y = projectedCenter.y;
    circle.drawCircle(0, 0, scaleFactor * circleRadius);
    circle.endFill();

    if (!circleRef.current) {
      circleRef.current = container.addChild(circle);
    }

    render();

    return () => {
      if (circleRef.current) {
        pixiOverlay?.utils.getContainer().removeChild(circleRef.current);
        circleRef.current.clear();
        circleRef.current = undefined;
        render();
      }
    };
  }, [pixiOverlay, render, center, radius, pathOptions]);

  return null;
};
