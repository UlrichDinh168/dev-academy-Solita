import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

export default function ContinuousSlider({ onFilter, min, max, name, label, value }) {

  const handleChange = (event, newValue) => {
    onFilter(newValue, name)
  };

  return (
    <Box sx={{ width: 200 }} className='slider-container'>
      <Typography id="input-slider" gutterBottom sx={{ color: 'black' }}>
        {label}
      </Typography>
      <Slider
        sx={{ color: 'grey' }}
        value={(value) || max}
        min={min}
        defaultValue={max}
        max={max}
        step={label === 'Duration' ? 10 : 0.1}
        // marks
        spacing={4} direction="row"
        valueLabelDisplay="auto"
        onChange={handleChange} />
    </Box>
  );
}