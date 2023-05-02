import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Map from './Map';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
  padding: '0 4rem',
  maxHeight: 600, overflow: 'scroll',
  '@media (max-width: 780px)': {
    width: '400px'
  }
};

export default function BasicModal({ open, data, handleClose }) {

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

  const _handleClose = () => {
    handleClose()
    setViewIndex(0)
  }
  console.log(viewIndex, 'viewindex');
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={_handleClose}
      >
        <Box sx={style}
        >
          <ArrowBackIosIcon
            onClick={handlePreviousClick}
            sx={{ cursor: 'pointer', "&:hover": { opacity: "0.5" }, position: 'absolute', top: '50%', left: '1.5rem' }} />
          <ArrowForwardIosIcon
            onClick={handleNextClick}
            sx={{ cursor: 'pointer', "&:hover": { opacity: "0.5" }, position: 'absolute', top: '50%', right: '1.5rem' }} />

          {views[viewIndex]}

        </Box>
      </Modal>
    </div>
  );
}

function View1({ data }) {
  console.log(data, 'data');
  const { numStationsAtDest, numStationsAtStart, averageDistanceAtDest, averageDistanceAtStart, currentX, currentY, Osoite, Name } = data
  const title = 'Basic info'

  return (
    <Box>
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', margin: '1rem 0' }}>
        {title}
      </Typography>
      <TableContainer sx={{ textAlign: 'center', margin: '1rem 0' }}>
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
        <Map  {...{ Osoite, Name, currentX, currentY }} />
      </div>
    </Box>
  )
}

function View2({ data }) {
  const { Name, Osoite, currentX, currentY, returnTop5Start } = data
  const title = 'Top 5 most popular return stations for journeys ending at the station'

  return (
    <Box>
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', margin: '2rem 0' }}>
        {title}
      </Typography>
      <TableContainer sx={{ textAlign: 'center', margin: '1rem 0' }}>
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

function View3({ data }) {
  const { Name, Osoite, currentX, currentY, returnTop5End } = data
  const title = 'Top 5 most popular return stations for journeys ending at the station'
  return (
    <Box>
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', margin: '2rem 0' }}>
        {title}
      </Typography>
      <TableContainer sx={{ textAlign: 'center', margin: '1rem 0' }}>
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
      <div style={{ height: '60vh' }}>
        <Map data={returnTop5End} {...{ Name, Osoite, currentX, currentY }} title={title} />
      </div>
    </Box>
  )
}