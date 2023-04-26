import React, { useCallback, useState, useRef, useEffect } from "react";
import { instance } from '../../constant'

import Input from "../shared/Input";
import Button from "../shared/Button";
import SearchResults from "../searchResult/searchResult";

const Searchbar = ({ isOrigin }) => {

  const originRef = useRef(null)
  const destRef = useRef(null)
  const inputName = isOrigin ? "origin" : "destination";
  const inputLabel = isOrigin ? "Origin" : "Destination";
  const inputId = isOrigin ? "origin-input" : "destination-input";
  const inputPlaceholder = isOrigin ? "Majurinkatu 3C" : "Pasila Espoo";

  const inputRef = isOrigin ? originRef : destRef
  //  const inputChange = isOrigin ? 
  const [isFocus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false)
  const [journey, setJourney] = useState([])
  const [searchResults, setSearchResults] = useState([])
  // const [inputChange, setInputChange] = useState('');

  const [input, setInput] = useState("");
  console.log(input, 'input');

  const handleChange = async (e) => {
    const { value, name } = e.target;
    setInput(value);
    // setInputChange(name)

    // return
    if (value.length >= 2) {
      console.log(name, value, 'here');

      const resp = await instance.post('/api/search', {
        data: value
      })
      console.log(resp, 'resp');
      setSearchResults(resp.data.data)
    } else {
      setSearchResults([])
    }
    // isOrigin ? originRef.current.value = value : destRef.current.value = value

  };
  const selectResult = (result) => {
    console.log(result?.Name, 'result');
    setFocus(false);
    setInput(result?.Name)
    inputRef.current.value = result?.Name

  };
  console.log(inputRef?.current?.value, 'inputRef');
  const handleFocus = (params) => {
    setFocus(true)
  }

  const handleBlur = () => {
    setFocus(false);
  };

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
        // value={form.DepartureName}
        focus={isFocus}
      // handleClickInputIcon={handleReset}
      />
      {searchResults && isFocus ? (
        <SearchResults
          inputId={inputId}
          // isOrigin={isOrigin}
          searchValue={input}
          searchResults={searchResults}
          selectResult={selectResult}
        />
      ) : null}
    </div>
  );
};

export default Searchbar;
