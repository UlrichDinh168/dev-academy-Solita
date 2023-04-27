import React, { useCallback, useState, useRef, useEffect } from "react";
import { instance } from '../../constant'

import Input from "../shared/Input";
import SearchResults from "../SearchResult/SearchResult";

const Searchbar = ({ isOrigin, onSetFormValues, formSubmit }) => {

  const originRef = useRef(null)
  const destRef = useRef(null)
  const inputId = isOrigin ? "origin-input" : "destination-input";

  const inputRef = isOrigin ? originRef : destRef
  const [isFocus, setFocus] = useState(false);
  const [searchResults, setSearchResults] = useState([])

  const [input, setInput] = useState("");

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setInput(value);
    if (value.length >= 2) {
      const resp = await instance.post('/api/search', {
        data: value
      })
      setSearchResults(resp.data.data)
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

  const handleFocus = (params) => {
    setFocus(true)
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setFocus(false);
    if (formSubmit[name] === undefined) setInput('')
  };

  const handleReset = () => {
    setInput('')
    inputRef.current.value = ''
    setSearchResults([])
  }
  return (
    <div className='searchBar__container'>
      <Input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type='text'
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
          selectResult={selectResult}
        />
      ) : null}
    </div>
  );
};

export default Searchbar;
