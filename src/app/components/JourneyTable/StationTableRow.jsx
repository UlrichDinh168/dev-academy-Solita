import React from 'react'
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';


const StationTableRow = ({ row, labelId, handleClick, type }) => {
  return (
    <TableRow
      hover
      tabIndex={-1}
      onClick={() => handleClick(row)}
      sx={{ cursor: `${type !== 'journey' ? 'pointer' : 'auto'}` }}
    >
      <TableCell
        component="th"
        id={labelId}
        scope="row"
        padding="normal"
      >
        {row['Name']}
      </TableCell>
      <TableCell align="right">{row['Operaattor']}</TableCell>
      <TableCell
        align="right">{row['Osoite']}
      </TableCell>
      <TableCell
        align="right">{row['Kaupunki']}
      </TableCell>
    </TableRow>
  )
}

export default StationTableRow