import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const JourneyTableRow = (row, index, labelId) => {
  return (
    <TableRow
      hover
      tabIndex={-1}
      key={index}
      sx={{ cursor: `${row?.type !== 'journey' ? 'pointer' : ''} ` }}
    >
      <TableCell component='th' id={labelId} scope='row' padding='normal' data-cy={`table-data`}>
        {row?.row['Departure station name']}
      </TableCell>
      <TableCell data-cy={`table-data`} align='right'>
        {row?.row['Return station name']}
      </TableCell>
      <TableCell data-cy={`table-data`} align='right'>
        {row?.row['Covered distance (m)']}
      </TableCell>
      <TableCell data-cy={`table-data`} align='right'>
        {row?.row['Duration (sec)']}
      </TableCell>
    </TableRow>
  );
};

export default JourneyTableRow;
