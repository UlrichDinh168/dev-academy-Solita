import React, { useCallback, useState, useRef, useEffect } from "react";
import { instance } from '../../constant'

import Input from "../shared/Input";
import SearchResults from "../SearchResult/SearchResult";

const Searchbar = ({ isOrigin, onSetFormValues, formSubmit, type, label }) => {

  const originRef = useRef(null)
  const destRef = useRef(null)
  const inputRef = isOrigin ? originRef : destRef

  const inputId = isOrigin ? "origin-input" : "destination-input";

  const [isFocus, setFocus] = useState(false);
  const [searchResults, setSearchResults] = useState([])
  const [input, setInput] = useState('');


  useEffect(() => {
    if (formSubmit['Name'] && formSubmit['Name'] !== '') {
      setInput(formSubmit['Name'])
    }
  }, [formSubmit['Name']])


  const handleChange = async (e) => {
    const { value } = e.target;

    setInput(value);

    if (value.length >= 2) {
      if (type === 'base') {
        const resp = await instance.post('/api/station-search', {
          data: value
        })
        setSearchResults(resp.data.data)
      } else {
        const resp = await instance.post('/api/station-search-ext', {
          data: value
        })

        setSearchResults(resp.data.data)
      }
    } else {
      setSearchResults([])
    }
  };

  const selectResult = (result, name) => {
    setFocus(false);

    setInput(result?.Name)
    onSetFormValues(result, name)
    inputRef.current.value = result?.Name
  };

  const handleFocus = () => {
    setFocus(true)
  }

  const handleBlur = (e) => {
    const { name } = e.target
    if (formSubmit[name] === undefined && type === 'base') setInput('')
    if (formSubmit['Name'] === '') setInput('')
    setFocus(false);
  };

  const handleReset = () => {
    setInput('')
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
