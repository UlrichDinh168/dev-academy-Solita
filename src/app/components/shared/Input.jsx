/** @format */

import React from "react";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';

const Input = ({
  label,
  onChange,
  placeholder,
  name,
  inputRef,
  focus,
  id,
  onFocus,
  type,
  disabled,
  value,
  onBlur,
  handleClearClick
}) => {
  return (
    <div className='input__wrapper' >
      <TextField
        type={type}
        label={label}
        value={value}
        disabled={disabled}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        size='small'
        inputRef={inputRef}
        id={id}
        sx={{ marginBottom: 1.5, marginRight: 2, width: '100%', border: 'gray' }}
        autoComplete="off"
        onFocus={onFocus}
        onBlur={onBlur}
        InputProps={id === '0' ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClearClick}
                edge="end"
              >
                {value ? <ClearIcon /> : null}
              </IconButton>
            </InputAdornment>
          )
        } : null}
      />
    </div>
  );
};

export default Input;
