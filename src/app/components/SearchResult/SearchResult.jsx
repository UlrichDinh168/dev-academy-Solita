import React from "react";

const SearchResults = ({
  searchValue,
  inputId,
  searchResults,
  selectResult,
  inputName,
  type
}) => {
  const renderResults = () => {
    if (searchResults?.length === 0) return;
    if (searchValue.length > 2)
      return searchResults?.map((result, index) => {
        return (
          <li
            className='address'
            onMouseDown={() => selectResult(result, inputName)}
            key={index}>
            <span className='address__main'>{result?.Name}</span>
            {type !== 'base' ? <span className='address__secondary'>{result.postalcode} {result.region}</span> : null}
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
