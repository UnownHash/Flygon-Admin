import { memo } from 'react';
import { LayersControl } from 'react-leaflet';

import { Polyline } from './pixi/Polyline';
import { MapProps } from './types';
import { PixiOverlay } from './pixi/PixiOverlay';

export const RoutesLayers = memo(({ routes }: Pick<MapProps, 'routes'>): JSX.Element => {
  return (
    <>
      {Array.isArray(routes) &&
        routes.length > 0 &&
        routes.map(
          (route, index) =>
            route.values.length > 0 && (
              <LayersControl.Overlay
                key={`${route.name}-${index}`}
                checked
                name={`${route.name} (${route.values.length})`}
              >
                <PixiOverlay>
                  <Polyline pathOptions={{ color: route.color }} positions={route.values} />
                </PixiOverlay>
              </LayersControl.Overlay>
            ),
        )}
    </>
  );
});
RoutesLayers.displayName = 'RoutesLayers';
