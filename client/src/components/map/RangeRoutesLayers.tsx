import { memo } from 'react';
import { LayersControl } from 'react-leaflet';

import { MapProps } from './types';
import { Circle } from './pixi/Circle';
import { PixiOverlay } from './pixi/PixiOverlay';

export const RangeRoutesLayers = memo(({ rangeRoutes }: Pick<MapProps, 'rangeRoutes'>): JSX.Element => {
  return (
    <>
      {Array.isArray(rangeRoutes) &&
        rangeRoutes.length > 0 &&
        rangeRoutes.map(
          (rangeRoute, index) =>
            rangeRoute.values.length > 0 && (
              <LayersControl.Overlay
                key={`${rangeRoute.name}-${index}`}
                checked
                name={`${rangeRoute.name} (${rangeRoute.values.length})`}
              >
                <PixiOverlay>
                  {rangeRoute.values.map((coordinates, rangeRouteIndex) => (
                    <Circle
                      key={`${rangeRouteIndex}-${coordinates[0]},${coordinates[1]}`}
                      pathOptions={{ color: rangeRoute.color }}
                      center={coordinates}
                      radius={rangeRoute.range}
                    />
                  ))}
                </PixiOverlay>
              </LayersControl.Overlay>
            ),
        )}
    </>
  );
});
RangeRoutesLayers.displayName = 'RangeRoutesLayers';
