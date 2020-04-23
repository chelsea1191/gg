import React, { useState, Fragment, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

const SearchDropdown = ({ allGames, setFiltered }) => {
  const reset = (ev) => {
    ev.preventDefault();
    setFiltered(allGames);
  };
  const onChange = (search) => {
    if (search.length > 0) {
      let filtered = allGames.filter((each) => {
        let uppercaseName = each.name.toUpperCase();
        let uppercaseSearchInput = search[0].name.toUpperCase();
        return uppercaseName.includes(uppercaseSearchInput);
      });
      setFiltered(filtered);
      localStorage.setItem('filtered', JSON.stringify(filtered));
    } else {
      setFiltered(allGames);
    }
  };
  return (
    <Fragment>
      <Typeahead
        id="custom-selections-example"
        labelKey="name"
        onChange={onChange} //
        options={allGames}
        placeholder="Choose a game..."
        selectHintOnEnter
        highlightOnlyResult
      />
      <button onClick={(ev) => reset(ev)}>
        <h5>Reset</h5>
      </button>
    </Fragment>
  );
};

export default SearchDropdown;
