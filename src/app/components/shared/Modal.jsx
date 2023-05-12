import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import BasicView from '../StationViews/BasicView';
import TopReturn from '../StationViews/TopReturn';
import TopDeparture from '../StationViews/TopDeparture';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height: 1400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  padding: '4rem',
  maxHeight: 600, overflow: 'scroll',
  '@media (max-width: 780px)': {
    width: '400px'
  }
};

const ModalComp = ({ open, data, handleClose }) => {
  const [viewIndex, setViewIndex] = useState(0);
  const handlePreviousClick = () => {
    setViewIndex((prevIndex) => prevIndex === 0 ? views.length - 1 : prevIndex - 1);
  };

  const handleNextClick = () => {
    setViewIndex((prevIndex) => (prevIndex + 1) % views.length);
  };

  const views = [
    <BasicView data={data} />,
    <TopDeparture data={data} />,
    <TopReturn data={data} />,
  ];

  const _handleClose = () => {
    handleClose()
    setViewIndex(0)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={_handleClose}
        data-cy='modal'
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


export default ModalComp