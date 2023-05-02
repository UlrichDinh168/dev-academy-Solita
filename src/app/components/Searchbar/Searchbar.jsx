import React, { useCallback, useState, useRef, useEffect } from "react";
import { instance } from '../../constant'
import axios from 'axios';

import Input from "../shared/Input";
import SearchResults from "../SearchResult/SearchResult";

const Searchbar = ({ isOrigin, onSetFormValues, formSubmit, type, label }) => {

  const originRef = useRef(null)
  const destRef = useRef(null)
  const inputId = isOrigin ? "origin-input" : "destination-input";

  const inputRef = isOrigin ? originRef : destRef
  const [isFocus, setFocus] = useState(false);
  const [searchResults, setSearchResults] = useState([])

  const [input, setInput] = useState('');
  const apiKey = '5119eaf4-9206-46a6-9c06-2e7ffa98d33c';

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setInput(value);

    if (value.length >= 2) {
      if (type === 'base') {
        const resp = await instance.post('/api/search', {
          data: value
        })
        setSearchResults(resp.data.data)
      } else {
        const resp = await instance.post('/api/search-ext', {
          data: value
        })
        setSearchResults(resp.data.data)

      }

    } else {
      setSearchResults([])
    }
  };
  const selectResult = (result, name) => {
    console.log(result, 'result');
    setFocus(false);

    setInput(result?.Name)
    onSetFormValues(result, name)
    inputRef.current.value = result?.Name
  };

  const handleFocus = () => {
    setFocus(true)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    if (formSubmit[name] === undefined && type === 'base') setInput('')
    if (formSubmit['Name'] === '') setInput('')
    setFocus(false);
  };

  const handleReset = () => {
    setInput('')
    inputRef.current.value = ''
    inputRef.current.focus()
    setSearchResults([])
  }
  return (
    <div className='searchBar__container'>
      <Input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type='text'
        id='0'
        placeholder='Type to search ...'
        label={label}
        value={input}
        inputRef={inputRef}
        name={isOrigin ? "Departure station name" : "Return station name"}
        focus={isFocus}
        handleClearClick={handleReset}
      />
      {searchResults.length > 0 && isFocus ? (
        <SearchResults
          inputId={inputId}
          inputName={isOrigin ? "Departure station name" : "Return station name"}
          searchValue={input}
          searchResults={searchResults}
          type={type}
          selectResult={selectResult}
        />
      ) : null}
    </div>
  );
};

export default Searchbar;
