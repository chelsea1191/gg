import React, { useState, Fragment, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

const SearchDropdown = ({ allGames, setFiltered }) => {
  useEffect(() => {
    let filteredItemIfPresent = JSON.parse(localStorage.getItem('filtered'));
    if (filteredItemIfPresent) {
      setFiltered(filteredItemIfPresent);
    }
  }, [setFiltered]);

  const onChange = (search) => {
    if (search.length > 0) {
      let filtered = allGames.filter((each) => {
        let uppercaseName = each.name.toUpperCase();
        let uppercaseSearchInput = search[0].name.toUpperCase();
        return uppercaseName.includes(uppercaseSearchInput);
      });
      setFiltered(filtered);
      localStorage.setItem('filtered', JSON.stringify(filtered));
    }
  };
  return (
    <Fragment>
      <Typeahead
        id='custom-selections-example'
        labelKey='name'
        onChange={onChange} //
        options={allGames}
        placeholder='Choose a game...'
        selectHintOnEnter
        highlightOnlyResult
      />
    </Fragment>
  );
};

export default SearchDropdown;
