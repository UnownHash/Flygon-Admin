import { ReactNode, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import * as L from 'leaflet';
import 'leaflet-pixi-overlay';
import { useLeafletContext } from '@react-leaflet/core';
import debounce from 'lodash/debounce';

import { PixiContextProvider, PixiOverlayInterface, PixiUtils } from './PixiContext';

export const PixiOverlay = ({ children }: { children?: ReactNode }) => {
  const [pixiOverlay, setPixiOverlay] = useState<PixiOverlayInterface | null>(null);
  const [renderFunction, setRenderFunction] = useState<undefined | (() => void)>(undefined);
  const leafletContext = useLeafletContext();
  const mapContainer = leafletContext.layerContainer ?? leafletContext.map;

  useEffect(() => {
    if (leafletContext.map.getZoom() === undefined) {
      // this if statement is to avoid getContainer error
      // map must have zoom prop
      console.error('no zoom found, add zoom prop to map to avoid getContainer error');
      return;
    }

    const pixiContainer = new PIXI.Container();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const overlay = L.pixiOverlay((utils: PixiUtils) => {
      // redraw markers
      const scale = utils.getScale();

      utils.getContainer().children.forEach((child) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        child.currentScale = child.scale.x;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        child.targetScale = 1 / scale;
      });

      utils.getRenderer().render(utils.getContainer());
    }, pixiContainer);

    mapContainer.addLayer(overlay);
    setPixiOverlay(overlay);

    setRenderFunction(() =>
      // since I don't know how to batch renders, I debounced the render function
      debounce(() => {
        overlay.utils.getRenderer().render(overlay.utils.getContainer());
      }, 100),
    );

    return () => {
      pixiContainer.removeChildren();
      mapContainer.removeLayer(overlay);
    };
  }, [mapContainer]);

  return <PixiContextProvider value={{ pixiOverlay, render: renderFunction }}>{children}</PixiContextProvider>;
};
