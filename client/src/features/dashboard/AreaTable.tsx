import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { memo } from 'react'

import { StatusTable } from './StatusTable'
import { Area } from '@features/area/type'
import { Worker } from '@features/workers/type'

export const AreaTable = ({
  area,
  workers,
  expanded,
  onChange,
}: {
  area: Area
  workers: Worker[]
  expanded?: boolean
  onChange: () => void
}): JSX.Element => {
  return (
    <Accordion
      defaultExpanded
      disableGutters
      disabled={!workers.length}
      expanded={!!(expanded && workers.length)}
      onChange={onChange}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${area.name}-content`}
        id={`${area.name}-header`}
      >
        <Typography>{area.name}</Typography>
      </AccordionSummary>
      {!!workers.length && (
        <AccordionDetails>
          <StatusTable workers={workers} />
        </AccordionDetails>
      )}
    </Accordion>
  )
}

export const MemoAreaTable = memo(
  AreaTable,
  (prev, next) =>
    !next.workers.length &&
    prev.expanded === next.expanded &&
    prev.workers.every(
      (w, i) =>
        w.uuid === next.workers[i].uuid &&
        w.step === next.workers[i].step &&
        w.last_seen === next.workers[i].last_seen,
    ),
)
