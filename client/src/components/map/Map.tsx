import type { Map as MapType } from 'leaflet';
import { LayersControl, MapContainer, TileLayer } from 'react-leaflet';
import { forwardRef, memo } from 'react';

import { MapProps } from './types';
import { GeofencesLayers } from './GeofencesLayers';
import { RoutesLayers } from './RoutesLayers';
import { RangeRoutesLayers } from './RangeRoutesLayers';

export const Map = memo(
  forwardRef<MapType, MapProps>(({ geofences, rangeRoutes, routes }, ref): JSX.Element => {
    return (
      <MapContainer
        center={[51.505, -0.09]}
        preferCanvas
        ref={ref}
        scrollWheelZoom={false}
        style={{ height: 500, width: '100%' }}
        zoom={13}
      >
        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        />
        <LayersControl position="topright">
          <GeofencesLayers geofences={geofences} />
          <RoutesLayers routes={routes} />
          <RangeRoutesLayers rangeRoutes={rangeRoutes} />
        </LayersControl>
      </MapContainer>
    );
  }),
);
Map.displayName = 'Map';
