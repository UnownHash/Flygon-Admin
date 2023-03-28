import { useState, ReactNode } from 'react';
import { useQuery } from 'react-query';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GppGood from '@mui/icons-material/GppGood';
import BlockIcon from '@mui/icons-material/Block';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import SecurityUpdateWarningIcon from '@mui/icons-material/SecurityUpdateWarning';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

import type { LevelStats } from './type';

export const TableHeader = ({ secondary = false }: { secondary?: boolean }) => (
  <TableHead>
    <TableRow>
      <TableCell align="center">
        <Chip
          disabled={secondary}
          icon={<SquareFootIcon fontSize="small" />}
          label="Level"
          color="primary"
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <Chip
          disabled={secondary}
          icon={<PeopleAltIcon fontSize="small" />}
          label="Total"
          color="secondary"
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <Chip disabled={secondary} icon={<GppGood fontSize="small" />} label="Good" color="success" size="small" />
      </TableCell>
      <TableCell align="center">
        <Chip
          disabled={secondary}
          icon={<PersonOffIcon fontSize="small" />}
          label="Disabled"
          color="info"
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <Chip
          disabled={secondary}
          icon={<WarningAmberIcon fontSize="small" />}
          label="Warned"
          color="warning"
          size="small"
        />
      </TableCell>
      <TableCell align="center">
        <Chip
          disabled={secondary}
          icon={<SecurityUpdateWarningIcon fontSize="small" />}
          label="Suspended"
          size="small"
          color="warning"
        />
      </TableCell>
      <TableCell align="center">
        <Chip disabled={secondary} icon={<BlockIcon fontSize="small" />} label="Banned" color="error" size="small" />
      </TableCell>
      <TableCell align="center">
        <Chip disabled={secondary} icon={<BlockIcon fontSize="small" />} label="Invalid" color="error" size="small" />
      </TableCell>
    </TableRow>
  </TableHead>
);

export const Row = ({ row, children, label }: { row: LevelStats; label?: string; children?: ReactNode[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell align="center" component="th" scope="row">
          <Box display="flex" alignItems="center">
            {!!children && (
              <IconButton size="small" disabled={!children.length} onClick={() => setOpen(!open)} sx={{ flexGrow: 0 }}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
            <Typography flexGrow={1}>{label || row.level}</Typography>
          </Box>
        </TableCell>
        <TableCell align="center">{row.count}</TableCell>
        <TableCell align="center">
          {row.count - row.warn - row.suspended - row.banned - row.disabled - row.invalid}
        </TableCell>
        <TableCell align="center">{row.disabled}</TableCell>
        <TableCell align="center">{row.warn}</TableCell>
        <TableCell align="center">{row.suspended}</TableCell>
        <TableCell align="center">{row.banned}</TableCell>
        <TableCell align="center">{row.invalid}</TableCell>
      </TableRow>
      {!!children && (
        <TableRow>
          <TableCell sx={{ p: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table>
                <TableHeader secondary />
                <TableBody>{children}</TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export const LevelStatsTable = () => {
  const { data } = useQuery<LevelStats[]>(
    ['levelstats'],
    () => fetch(`/api/accounts/level-stats`).then((res) => res.json()),
    { refetchInterval: 5000 },
  );

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHeader />
        <TableBody>
          {[
            { min: 0, max: 0, label: '0' },
            { min: 1, max: 29, label: '1 - 29' },
            { min: 30, max: 39, label: '30 - 39' },
            { min: 40, max: 100, label: '40 +' },
          ].map(({ min, max, label }) => {
            const filtered = data?.filter((row) => row.level >= min && row.level <= max) || [];
            const summary = filtered.reduce(
              (acc, cur) => {
                if (cur.level >= min && cur.level <= max) {
                  acc.count += cur.count;
                  acc.warn += cur.warn;
                  acc.suspended += cur.suspended;
                  acc.banned += cur.banned;
                  acc.disabled += cur.disabled;
                  acc.invalid += cur.invalid;
                }
                return acc;
              },
              { level: 0, count: 0, warn: 0, suspended: 0, banned: 0, disabled: 0, invalid: 0 },
            );
            return summary ? (
              <Row key={label} label={label} row={summary}>
                {new Set(filtered.map((x) => x.level)).size > 1
                  ? filtered
                      .sort((a, b) => a.level - b.level)
                      .map((row) => <Row key={`${label}_${row.level}`} row={row} />)
                  : []}
              </Row>
            ) : null;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
