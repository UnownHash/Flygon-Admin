import type { LatLngTuple, Map as MapType } from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { useRecordContext } from 'react-admin';

import { Area, CordsList } from './type';
import { Map } from '@components/map';

const coordinatesToLatLngTuple = (coords?: CordsList): LatLngTuple[] =>
  Array.isArray(coords) ? coords.map<LatLngTuple>((coord) => [coord.lat, coord.lon]) : [];

export const MapPreviewField = (): JSX.Element => {
  const area = useRecordContext<Area>();

  if (!area) {
    return <></>;
  }

  return <MapPreview area={area} />;
};

interface MapPreviewProps {
  area: Pick<Area, 'geofence'> & {
    pokemon_mode: Pick<Area['pokemon_mode'], 'route'>;
    fort_mode: Pick<Area['fort_mode'], 'route'>;
    quest_mode: Pick<Area['quest_mode'], 'route'>;
  };
}

export const MapPreview = ({ area }: MapPreviewProps): JSX.Element => {
  const [map, setMap] = useState<MapType | null>(null);

  const geofences = useMemo(
    () => [
      {
        name: 'Geofence',
        values: coordinatesToLatLngTuple(area.geofence),
        color: '#2196f3',
      },
    ],
    [area.geofence],
  );

  const rangeRoutes = useMemo(
    () => [
      {
        name: 'Pokémon route',
        values: coordinatesToLatLngTuple(area.pokemon_mode.route),
        color: '#4caf50',
        range: 70,
      },
      {
        name: 'Fort route',
        values: coordinatesToLatLngTuple(area.fort_mode.route),
        color: '#f44336',
        range: 1500,
      },
    ],
    [area.pokemon_mode.route, area.fort_mode.route],
  );

  const routes = useMemo(
    () =>
      area.quest_mode.route?.length > 0
        ? [
            {
              name: 'Quest route',
              values: coordinatesToLatLngTuple(area.quest_mode.route),
              color: '#ffeb3b',
            },
          ]
        : [],
    [area.quest_mode.route],
  );

  useEffect(() => {
    if (!map || geofences[0].values.length === 0) {
      return;
    }

    map.fitBounds(geofences[0].values);
  }, [map, geofences]);

  return <Map ref={setMap} geofences={geofences} rangeRoutes={rangeRoutes} routes={routes} />;
};

MapPreviewField.defaultProps = { label: 'Preview' };
