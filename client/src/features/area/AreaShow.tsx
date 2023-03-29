import {
  BooleanField,
  FunctionField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin'
import { Typography } from '@mui/material'

import { Area } from './type'
import { MapPreviewField } from './MapPreviewField'

export const AreaShow = () => (
  <Show>
    <SimpleShowLayout>
      <Typography variant="h6" gutterBottom>
        Overview
      </Typography>
      <TextField source="name" />
      <MapPreviewField />
      <NumberField source="pokemon_mode.workers" label="Pokemon workers" />
      <NumberField source="fort_mode.workers" label="Fort workers" />
      <Typography variant="h6" gutterBottom>
        Quests
      </Typography>
      <BooleanField source="enable_quests" label="Enabled" />
      <NumberField source="quest_mode.workers" label="Quest workers" />
      <FunctionField<Area>
        label="Quest hours"
        render={(area) => {
          const hours = area?.quest_mode.hours
          if (!hours || !Array.isArray(hours) || hours.length < 2) {
            return '-'
          }

          return hours.join(',')
        }}
      />
      <NumberField
        source="quest_mode.max_login_queue"
        label="Quest max login queue"
      />
    </SimpleShowLayout>
  </Show>
)
