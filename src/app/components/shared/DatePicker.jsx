import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export function YearPicker({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={(e) => onChange(e)} openTo="year" label={'"year"'} views={['year']} />
    </LocalizationProvider>
  );
}
export function MonthPicker({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={(e) => onChange(e)} label={'"month"'} openTo="month"
        views={['month']} />
    </LocalizationProvider>
  );
}
export function YearMonthPciker({ value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={value} onChange={(e) => onChange(e)}
        views={['month', 'year']} />
    </LocalizationProvider>
  );
}
