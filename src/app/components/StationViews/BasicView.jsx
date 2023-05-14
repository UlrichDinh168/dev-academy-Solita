import React from 'react';
import Box from '@mui/material/Box';
import Map from '../shared/Map';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const BasicView = ({ data }) => {
  const {
    numStationsAtDest,
    numStationsAtStart,
    averageDistanceAtDest,
    averageDistanceAtStart,
    currentLatitude,
    currentLongitude,
    Osoite,
    Name,
  } = data;
  const title = 'Basic info';

  return (
    <Box>
      <h2 style={{ textAlign: 'center' }}>{title}</h2>

      <TableContainer sx={{ textAlign: 'center', margin: '1rem 0', marginBottom: '3rem' }}>
        <Table responsive='true'>
          <TableBody>
            <TableRow>
              <TableCell>Total number of journeys starting from the station</TableCell>
              <TableCell>{numStationsAtStart}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Total number of journeys ending at the station</TableCell>
              <TableCell>{numStationsAtDest}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>The average distance of a journey starting from the station</TableCell>
              <TableCell>{parseFloat(averageDistanceAtStart / 1000).toFixed(2)} km</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>The average distance of a journey ending at the station</TableCell>
              <TableCell>{parseFloat(averageDistanceAtDest / 1000).toFixed(2)} km</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ height: '60vh' }}>
        <Map {...{ Osoite, Name, currentLatitude, currentLongitude }} />
      </div>
    </Box>
  );
};

export default BasicView;
