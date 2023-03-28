import { Edit } from 'react-admin';

import { AreaForm } from './AreaForm';
import { Area } from './type';

const transformPayload = (area: Area): Area => {
  let hours = [];

  try {
    if (typeof area.quest_mode.hours === 'string') {
      hours = JSON.parse(area.quest_mode.hours as unknown as string);
    } else if (Array.isArray(area.quest_mode.hours)) {
      hours = area.quest_mode.hours;
    }
  } catch (error) {
    console.error(error);
  }

  return {
    ...area,
    quest_mode: {
      ...area.quest_mode,
      hours: Array.isArray(hours) && hours.length > 0 ? hours : undefined,
    },
  };
};

export const AreaEdit = () => (
  <Edit mutationMode="pessimistic" transform={transformPayload}>
    <AreaForm />
  </Edit>
);
