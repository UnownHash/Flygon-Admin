import { BooleanInput, FormDataConsumer, NumberInput, SimpleForm, TextInput } from 'react-admin';
import { Box, Typography } from '@mui/material';

import { MapPreview } from './MapPreviewField';
import { RouteInput } from '@components/inputs/RouteInput';

export const AreaForm = () => (
  <SimpleForm>
    <Typography variant="h6" gutterBottom>
      General
    </Typography>
    <TextInput source="name" fullWidth required />
    <FormDataConsumer>
      {({ formData }) => {
        const area = {
          geofence: formData?.geofence && Array.isArray(formData.geofence) ? formData.geofence : [],
          pokemon_mode: { route: Array.isArray(formData?.pokemon_mode?.route) ? formData.pokemon_mode.route : [] },
          fort_mode: { route: Array.isArray(formData?.fort_mode?.route) ? formData.fort_mode.route : [] },
          quest_mode: { route: Array.isArray(formData?.quest_mode?.route) ? formData.quest_mode.route : [] },
        };

        return <MapPreview area={area} />;
      }}
    </FormDataConsumer>
    <Box pt="1em" />
    <RouteInput source="geofence" label="Geofence" />
    <Typography variant="h6" gutterBottom>
      Pokémon mode
    </Typography>
    <NumberInput label="Workers" source="pokemon_mode.workers" fullWidth defaultValue={0} min={0} required />
    <RouteInput source="pokemon_mode.route" label="Route" />
    <Typography variant="h6" gutterBottom>
      Fort mode
    </Typography>
    <NumberInput label="Workers" source="fort_mode.workers" fullWidth defaultValue={0} min={0} required />
    <RouteInput source="fort_mode.route" label="Route" />
    <Typography variant="h6" gutterBottom>
      Quest mode
    </Typography>
    <BooleanInput source="enable_quests" label="Enabled" />
    <NumberInput label="Workers" source="quest_mode.workers" fullWidth defaultValue={0} min={0} required />
    <TextInput
      source="quest_mode.hours"
      label="Quest Hours"
      fullWidth
      format={(hours) => (Array.isArray(hours) ? JSON.stringify(hours) : hours)}
      defaultValue={'[]'}
    />
    <RouteInput source="quest_mode.route" label="Route" />
    <NumberInput source="quest_mode.max_login_queue" label="Max login queue" fullWidth />
  </SimpleForm>
);
