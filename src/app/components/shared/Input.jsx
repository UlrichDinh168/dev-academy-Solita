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
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        size='small'
        inputRef={inputRef}
        id={id}
        sx={{ marginBottom: 0.5, marginRight: 2 }}
        autoComplete="off"
        onFocus={onFocus}
        onBlur={onBlur}
        InputProps={{
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
        }}
      />
    </div>
  );
};

export default Input;
