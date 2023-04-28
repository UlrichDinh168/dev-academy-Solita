import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Map from './Map';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: 600, overflow: 'scroll',
};

export default function BasicModal({ open, data, handleClose, loading }) {
  const [viewIndex, setViewIndex] = React.useState(0);
  const handlePreviousClick = () => {
    setViewIndex((prevIndex) => prevIndex === 0 ? views.length - 1 : prevIndex - 1);
  };

  const handleNextClick = () => {
    setViewIndex((prevIndex) => (prevIndex + 1) % views.length);
  };
  const views = [
    <View1 data={data} />,
    <View2 data={data} />,
    <View3 data={data} />,
  ];

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button onClick={handlePreviousClick}>Toggle View</button>
          <button onClick={handleNextClick}>Toggle View</button>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
          {views[viewIndex]}

          {/* </Typography> */}
        </Box>
      </Modal>
    </div>
  );
}

function View1({ data }) {
  console.log(data, 'data');
  const { numStationsAtDest, numStationsAtStart, averageDistanceAtDest, averageDistanceAtStart, currentX, currentY, Osoite, Name } = data

  return (
    <Box>
      <TableContainer>
        <Table responsive>
          <TableHead>
            <TableRow>
              <TableCell>numStationsAtStart</TableCell>
              <TableCell>numStationsAtDest</TableCell>
              <TableCell>averageDistanceAtStart</TableCell>
              <TableCell>averageDistanceAtDest</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow >
              <TableCell>{numStationsAtStart}</TableCell>
              <TableCell>{numStationsAtDest}</TableCell>
              <TableCell>{parseFloat(averageDistanceAtStart / 1000).toFixed(2)} km</TableCell>
              <TableCell>{parseFloat(averageDistanceAtDest / 1000).toFixed(2)} km</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Map  {...{ Osoite, Name, currentX, currentY }} />
    </Box>
  )
}

function View2({ data }) {
  const { Name, Osoite, currentX, currentY, returnTop5Start } = data
  return (
    <Box>

      <TableContainer>
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
      <Map data={returnTop5Start} {...{ Name, Osoite, currentX, currentY }} />

    </Box>
  )
}

function View3({ data }) {
  const { Name, Osoite, currentX, currentY, returnTop5End } = data
  return (
    <Box>

      <TableContainer>
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
              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </TableContainer>
      <Map data={returnTop5End} {...{ Name, Osoite, currentX, currentY }} />

    </Box>
  )
}