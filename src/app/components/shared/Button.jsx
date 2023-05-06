import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButton({ text, disabled, onClick }) {
  return (
    <Button sx={{ background: 'lightgrey', height: '2.4rem', maxHeight: '3rem', color: 'black', width: '100%' }}
      onClick={onClick}
      disabled={disabled}
      variant="text"
      type='submit'
    >
      {text}
    </Button>
  );
}