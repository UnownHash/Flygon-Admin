import { memo } from 'react';
import { LayersControl } from 'react-leaflet';

import { Polygon } from './pixi/Polygon';
import { MapProps } from './types';
import { PixiOverlay } from './pixi/PixiOverlay';

export const GeofencesLayers = memo(({ geofences }: Pick<MapProps, 'geofences'>): JSX.Element => {
  return (
    <>
      {Array.isArray(geofences) &&
        geofences.length > 0 &&
        geofences.map(
          (geofence, index) =>
            geofence.values.length > 0 && (
              <LayersControl.Overlay key={`${geofence.name}-${index}`} checked name={geofence.name}>
                <PixiOverlay>
                  <Polygon pathOptions={{ color: geofence.color }} positions={geofence.values} />
                </PixiOverlay>
              </LayersControl.Overlay>
            ),
        )}
    </>
  );
});
GeofencesLayers.displayName = 'GeofencesLayers';
