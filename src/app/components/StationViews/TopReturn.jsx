import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Map from '../shared/Map';
import Box from '@mui/material/Box';


const TopDeparture = ({ data }) => {
  const { Name, Osoite, currentX, currentY, returnTop5Start } = data
  const title = 'Top 5 most popular return stations for journeys ending at the station'

  return (
    <Box>
      <h2 style={{ textAlign: 'center' }}>{title}</h2>

      <TableContainer sx={{ textAlign: 'center', margin: '1rem 0', marginBottom: '3rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Departure</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {returnTop5Start?.map((item, i) =>
              <TableRow key={i}>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.occurrences}</TableCell>
              </TableRow>
            )
            }
          </TableBody>

        </Table>
      </TableContainer>

      <div style={{ height: '60vh' }}>
        <Map data={returnTop5Start} {...{ Name, Osoite, currentX, currentY }} />
      </div>
    </Box>
  )
}

export default TopDeparture