import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Map from '../shared/Map';
import Box from '@mui/material/Box';


const TopDeparture = ({ data }) => {
  const { Name, Osoite, currentX, currentY, returnTop5End } = data
  const title = 'Top 5 most popular departure stations for journeys ending at the station'
  return (
    <Box>
      <h2 style={{ textAlign: 'center' }} >{title}</h2>

      <TableContainer sx={{ textAlign: 'center', margin: '1rem 0', marginBottom: '3rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Destination</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {returnTop5End?.map((item, i) =>
              <TableRow key={i}>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.occurrences}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ height: '60vh' }}>
        <Map data={returnTop5End} {...{ Name, Osoite, currentX, currentY }} title={title} />
      </div>
    </Box>
  )
}

export default TopDeparture