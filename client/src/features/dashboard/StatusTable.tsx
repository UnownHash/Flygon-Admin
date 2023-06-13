import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

import { Worker } from '@features/workers/type'
import { getRelativeTime } from './getRelativeTime'

export const StatusTable = ({
  workers,
}: {
  workers: Worker[]
}): JSX.Element => {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Worker</TableCell>
            <TableCell
              align="center"
              sx={{ display: { xs: 'none', md: 'table-cell' } }}
            >
              Account
            </TableCell>
            <TableCell align="center">Mode</TableCell>
            <TableCell align="center">Last Data</TableCell>
            <TableCell
              align="center"
              sx={{ display: { xs: 'none', md: 'table-cell' } }}
            >
              Start / Current / End
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workers
            .slice()
            .sort((a, b) => a.uuid.localeCompare(b.uuid))
            .map((worker, i) => {
              return (
                <TableRow key={`${worker.uuid || i}`}>
                  <TableCell>{worker.uuid}</TableCell>
                  <TableCell
                    align="center"
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  >
                    {worker.username}
                  </TableCell>
                  <TableCell align="center">{worker.mode}</TableCell>
                  <TableCell align="center">
                    {worker.username
                      ? getRelativeTime(worker.last_seen * 1000)
                      : 'never'}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ display: { xs: 'none', md: 'table-cell' } }}
                  >
                    {worker.start_step} / {worker.step} / {worker.end_step}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
