import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

export default function ContinuousSlider({ onFilter, min, max, name, label, value }) {

  const handleChange = (event, newValue) => {
    onFilter(newValue, name)
  };

  return (
    <Box sx={{ width: 200 }}>
      <Typography id="input-slider" gutterBottom sx={{ color: 'white' }}>
        {label}
      </Typography>
      <Slider
        value={(value) || max}
        min={min}
        defaultValue={max}
        max={max}
        valueLabelDisplay="auto"
        onChange={handleChange} />
    </Box>
  );
}