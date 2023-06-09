import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Modal from '../shared/Modal';
import PuffLoader from 'react-spinners/PuffLoader';
import TableHeader from './TableHeader';

import JourneyTableRow from './JourneyTableRow';
import StationTableRow from './StationTableRow';
import { getComparator, stableSort } from '../util';
import { instance } from '../../constant';

const DEFAULT_ORDER = 'asc';
const DEFAULT_ROWS_PER_PAGE = 10;

export default function EnhancedTable({ rows, headCells, type, defaultOrderBy }) {
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [page, setPage] = useState(0);
  const [visibleRows, setVisibleRows] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [details, setDetails] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Auto sort Table by DEFAULT_ORDER & defaultOrderBy whenever rows change
  useEffect(() => {
    let rowsOnMount = stableSort(rows, getComparator(DEFAULT_ORDER, defaultOrderBy));

    rowsOnMount = rowsOnMount?.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    );

    setVisibleRows(rowsOnMount);
  }, [rows, defaultOrderBy]);

  const handleSort = useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      const toggledOrder = isAsc ? 'desc' : 'asc';

      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
      const updatedRows = sortedRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage, rows]
  );

  const handlePageChange = useCallback(
    (event, newPage) => {
      setPage(newPage);
      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows?.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage
      );
      setVisibleRows(updatedRows);
    },
    [order, orderBy, rowsPerPage, rows]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const updatedRowsPerPage = Number(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows?.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, rows]
  );

  const handleClose = () => {
    setOpen(false);
    setDetails([]);
  };

  const handleClick = async (rowName) => {
    setOpen(true);
    setLoading(true);
    try {
      const response = await instance.post(`api/station/details`, {
        data: rowName.ID,
      });

      const { x: currentLatitude, y: currentLongitude, Name, Osoite } = rowName;

      let updatedResponse = {
        ...response?.data.data,
        currentLatitude,
        currentLongitude,
        Name,
        Osoite,
      };

      setDetails(updatedResponse);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (type === 'journey') {
      return visibleRows
        ? visibleRows.map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return <JourneyTableRow key={index} row={row} type={type} labelId={labelId} />;
          })
        : null;
    } else {
      return visibleRows
        ? visibleRows.map((row, index) => {
            const labelId = `enhanced-table-checkbox-${index}`;
            return (
              <StationTableRow
                loading={isLoading}
                key={index}
                row={row}
                type={type}
                labelId={labelId}
                handleClick={handleClick}
              />
            );
          })
        : null;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'right',
      }}
      className='journey-table-container'
    >
      <Paper sx={{ width: '100%', mb: 2 }} data-cy={`table-wrapper`}>
        <TableContainer sx={{ maxHeight: 400 }} data-cy={`table-container`}>
          <Table aria-label='sticky table' sx={{ maxHeight: 400, minWidth: 200 }}>
            <TableHeader
              order={order}
              orderBy={orderBy}
              headCells={headCells}
              onRequestSort={handleSort}
              rowCount={rows?.length}
            />
            <TableBody data-cy={`table-body`}>{renderContent()}</TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          showFirstButton
          showLastButton
          data-cy='pagination'
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <div className='loading'>{isLoading ? <PuffLoader /> : null}</div>

      <Modal open={open && details.length !== 0} data={details} handleClose={handleClose} />
    </Box>
  );
}
