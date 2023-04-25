import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButton({ text, onChange }) {
  return (
    <Button variant="text" onChange={onChange}>{text}</Button>
  );
}