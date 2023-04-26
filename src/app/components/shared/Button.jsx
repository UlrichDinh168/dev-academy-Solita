import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButton({ text, disabled, onClick }) {
  return (
    <Button onClick={onClick} disabled={disabled} variant="text" type='submit' >{text}</Button>
  );
}