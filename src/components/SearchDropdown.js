import React, { useState, Fragment, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import AdvancedSearch from './AdvancedSearch';

const SearchDropdown = ({ auth, filtered, allGames, setFiltered, link }) => {
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
        id='custom-selections-example'
        labelKey='name'
        onChange={onChange} //
        options={allGames}
        placeholder='Choose a game...'
        selectHintOnEnter
        highlightOnlyResult
      />
      {auth.id && (
        <div>
          <AdvancedSearch
            link={link}
            filtered={filtered}
            allGames={allGames}
            setFiltered={setFiltered}
          />
        </div>
      )}

      {link === 'allGames' && link != 'createUser' && (
        <button id='resetButton' onClick={(ev) => reset(ev)}>
          <h5>Clear Filters</h5>
        </button>
      )}
      {link === 'findPlayers' && link != 'createUser' && (
        <button id='resetButton' onClick={(ev) => reset(ev)}>
          <h5>Clear Filters/ Search All</h5>
        </button>
      )}
    </Fragment>
  );
};

export default SearchDropdown;
