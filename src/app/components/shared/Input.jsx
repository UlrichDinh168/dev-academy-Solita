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
  reference,
  focus,
  id,
  onFocus,
  type,
  value,
  onBlur,
  handleClickInputIcon, handleClearClick
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
        inputRef={reference}
        id={id}
        sx={{ m: 2, "&.Mui-focused .MuiIconButton-root": { color: 'primary.main' } }}

        onFocus={onFocus}
        onBlur={onBlur}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClearClick}
                // onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {value ? <ClearIcon /> : null}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {/* {!focus && (
        <div className='input__wrapper--clear' onClick={handleClickInputIcon}>
          <ClearIcon />
        </div>
      )} */}
    </div>
  );
};

export default Input;
