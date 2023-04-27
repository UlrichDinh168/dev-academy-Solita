import React from "react";

const SearchResults = ({
  searchValue,
  inputId,
  searchResults,
  selectResult,
  inputName
}) => {
  const renderResults = () => {
    if (searchResults?.length === 0) return;
    if (searchValue.length > 2)
      return searchResults?.map((result) => {
        return (
          <li
            className='address'
            onMouseDown={() => selectResult(result, inputName)}
            key={result._id}>
            <span className='address__secondary'>{result?.Name}</span>
          </li>
        );
      });
  };

  return (
    <ul className='result__list' id={inputId}>
      {renderResults()}
    </ul>
  );
};

export default SearchResults;
