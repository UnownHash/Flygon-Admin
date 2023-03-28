import { LatLngTuple } from 'leaflet';

export interface MapProps {
  geofences?: Array<{ name: string; values: LatLngTuple[]; color: string }>;
  rangeRoutes?: Array<{ name: string; values: LatLngTuple[]; range: number; color: string }>;
  routes?: Array<{ name: string; values: LatLngTuple[]; color: string }>;
}
