import * as React from 'react';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Modal from '../shared/Modal'


import TableHeader from './TableHeader';
import JourneyTableRow from './JourneyTableRow';
import StationTableRow from './StationTableRow';

import { getComparator, stableSort } from '../util'
import { instance } from '../../constant';

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'Duration (m)';
const DEFAULT_ROWS_PER_PAGE = 5;


export default function EnhancedTable({ rows, headCells, type }) {
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [page, setPage] = React.useState(0);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [details, setDetails] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);


  React.useEffect(() => {
    // const datasetArray = type ==='journey'? rows
    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
    );

    rowsOnMount = rowsOnMount?.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    );

    setVisibleRows(rowsOnMount);
  }, [rows]);

  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      const toggledOrder = isAsc ? 'desc' : 'asc';
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
      const updatedRows = sortedRows?.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage, rows],
  );

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);
      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows?.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      );
      setVisibleRows(updatedRows);
    },
    [order, orderBy, rowsPerPage, rows,],
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = Number(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows?.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      );

      setVisibleRows(updatedRows);

    },
    [order, orderBy, rows],
  );

  const handleClose = () => {
    setOpen(false)
    setDetails([])
  }


  console.log(details, 'details');

  const handleClick = async (rowName) => {
    setOpen(true)
    setLoading(true);
    try {
      const response = await instance.post(`api/station-details`, {
        data: rowName.ID
      })

      console.log(response, 'response');
      const { top5AtStart, top5AtEnd } = response?.data.data

      const fetchData = async (id) => {
        // Fetch data based on the given id
        const resp = await instance.post('/api/search', {
          data: id
        })
        return resp;
      };

      const fetchAllData = async (myArray) => {
        // Loop through the array and fetch data based on the second element in each item
        const promises = myArray.map(async (item) => {
          const data = await fetchData(item[0]);
          console.log(data?.data.data[0], 'data');
          return [...item, data?.data.data[0]]
          // return data?.data.data[0];
        });

        // Wait for all promises to resolve and return the result
        return Promise.all(promises);
      };
      let updatedResponse
      updatedResponse = { ...response?.data.data, currentX: rowName.x, currentY: rowName.y }

      fetchAllData(top5AtStart).then((res) => {
        console.log(res, 'res');

        updatedResponse = { ...updatedResponse, top5AtStart: res }
        if (updatedResponse.length !== 0) setDetails(updatedResponse)
        return updatedResponse

      })
      fetchAllData(top5AtEnd).then((res) => {
        console.log(res, 'res');
        updatedResponse = { ...updatedResponse, top5AtEnd: res }


        if (updatedResponse.length !== 0) setDetails(updatedResponse)
        return updatedResponse

      })
      console.log(updatedResponse, 'updatedResponse');

    }
    catch (err) {
      console.log(err)
    }
    setLoading(false);
  }

  const renderContent = () => {
    if (type === 'journey') {
      return visibleRows
        ? visibleRows.map((row, index) => {
          const labelId = `enhanced-table-checkbox-${index}`;
          return (
            <JourneyTableRow
              key={index}
              row={row}
              type={type}
              labelId={labelId} />
          )
        })
        : null
    } else {
      return visibleRows
        ? visibleRows.map((row, index) => {
          const labelId = `enhanced-table-checkbox-${index}`;
          return (
            <StationTableRow
              key={index}
              row={row}
              type={type}
              labelId={labelId}
              handleClick={handleClick}
            />
          )
        })
        : null
    }

  }
  console.log(open && loading && details.length !== 0, 'open && loading && details.length !== 0');
  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'right' }}
      className='journey-table-container'>
      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
        <TableContainer

          sx={{ maxHeight: 400 }}
        >
          <Table
            aria-label="sticky table"
            sx={{ maxHeight: 400, overflow: 'hidden', minWidth: 600 }}

          >
            <TableHeader

              order={order}
              orderBy={orderBy}
              headCells={headCells}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
            />
            <TableBody>
              {renderContent()}

            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal open={open && details.length !== 0} data={details} loading={loading} handleClose={handleClose} />
    </Box>
  );
}

