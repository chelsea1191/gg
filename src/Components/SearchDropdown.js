import React, { useState, Fragment, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

const SearchDropdown = ({ allGames, setFiltered }) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    //get filtered obj from local storage
    let filt = localStorage.getItem('filtered');
    setFiltered(JSON.parse(filt));
  }, []);

  const onChange = (search) => {
    let filtered = allGames.filter((each) => {
      let uppercaseName = each.name.toUpperCase();
      let uppercaseSearchInput = search[0].name.toUpperCase();
      return uppercaseName.includes(uppercaseSearchInput);
    });
    if (filtered.length > 0) {
      setFiltered(filtered);
      localStorage.removeItem('filtered');
      localStorage.setItem('filtered', JSON.stringify(filtered));
    } else {
      alert('no matches found');
    }
  };

  return (
    <Fragment>
      <Typeahead
        allowNew
        newSelectionPrefix='search for: '
        id='custom-selections-example'
        labelKey='name'
        onChange={onChange}
        options={allGames}
        placeholder='Choose a game...'
        selected={selected}
      />
    </Fragment>
  );
};

export default SearchDropdown;
