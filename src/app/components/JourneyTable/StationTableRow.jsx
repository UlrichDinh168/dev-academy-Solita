import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const StationTableRow = ({ row, labelId, handleClick, type, loading }) => {
  return (
    <TableRow
      hover
      data-cy='table-row'
      tabIndex={-1}
      onClick={() => !loading && handleClick(row)}
      sx={{ cursor: `${type !== 'journey' ? 'pointer' : 'none'}` }}
    >
      <TableCell component='th' id={labelId} scope='row' data-cy={`table-data`} padding='normal'>
        {row['Name']}
      </TableCell>
      <TableCell data-cy={`table-data`} align='right'>
        {row['Operaattor']}
      </TableCell>
      <TableCell data-cy={`table-data`} align='right'>
        {row['Osoite']}
      </TableCell>
      <TableCell data-cy={`table-data`} align='right'>
        {row['Kaupunki']}
      </TableCell>
      <TableCell data-cy={`table-data`} align='right'>
        {row['Kapasiteet']}
      </TableCell>
    </TableRow>
  );
};

export default StationTableRow;
