import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

export function YearMonthPciker({ value, onChange, disabled }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        disableFuture
        disabled={disabled}
        value={value}
        className='date-year-picker'
        onChange={(e) => onChange(e)}
        views={['month', 'year']}
      />
    </LocalizationProvider>
  );
}
