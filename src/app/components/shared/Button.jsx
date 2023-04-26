import * as React from 'react';
import Button from '@mui/material/Button';

export default function BasicButton({ text, disabled }) {
  return (
    <Button disabled={disabled} variant="text" type='submit'>{text}</Button>
  );
}