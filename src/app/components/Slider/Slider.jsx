import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

export default function ContinuousSlider({ onFilter, min, max, name, label, disabled, value }) {

  const handleChange = (event, newValue) => {
    onFilter(newValue, name)
  };

  return (
    <Box
      sx={{ width: 200, width: { xs: 150 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      className='slider-container'>

      <Typography id="input-slider" gutterBottom sx={{ color: 'black' }}>
        {label}
      </Typography>

      <Slider
        sx={{ color: 'grey', padding: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        value={(value) || max}
        min={min}
        size='small'
        defaultValue={max}
        disabled={disabled}
        max={max}
        step={label === 'Duration' ? 10 : 0.1}
        // marks
        spacing={4} direction="row"
        valueLabelDisplay="auto"
        onChange={handleChange} />
    </Box>
  );
}