import React, { useEffect } from 'react';
import shortid from 'shortid';

const Search = ({}) => {
  return (
    <div>
      <form className='form'>
        <input
          className='form-control'
          type='text'
          placeholder='Search'
          aria-label='Search'
          aria-describedby='emailHelp'
        />

        <small id='emailHelp' className='form-text text-muted'>
          Search here
        </small>
        <button className='btn btn-outline-success my-2 my-sm-0' type='submit'>
          Search
        </button>
      </form>
      <div className='container'></div>
    </div>
  );
};

export default Search;
