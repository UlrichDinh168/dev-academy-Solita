import React from "react";

const SearchResults = ({
  isOrigin,
  searchValue,
  inputId,
  searchResults,
  selectResult,
}) => {
  const renderResults = () => {
    console.log(searchResults, 'searchResults');
    if (searchResults?.length === 0) return;
    if (searchValue.length > 2)
      return searchResults?.map((result) => {
        return (
          <li
            className='address'
            onMouseDown={() => selectResult(result)}
            key={result._id}>
            <span className='address__secondary'>{result?.Name}</span>
          </li>
        );
      });
  };

  const key = isOrigin ? "origin" : "destination";

  return (
    <ul className='result__list' id={inputId}>
      {renderResults()}
    </ul>
  );
};

export default SearchResults;
