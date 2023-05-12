import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import { visuallyHidden } from '@mui/utils';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';

export default function TableHeader(props) {
  const { order, orderBy, onRequestSort, headCells } =
    props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };
  return (
    <TableHead
      data-cy={`table-header`}
    >
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}