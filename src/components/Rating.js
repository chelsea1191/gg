import React from 'react';

const Rating = ({ rating }) => {
  if (rating < 2) {
    return (
      <div>
        <span className='fa fa-star checked'></span>
        <span className='fa fa-star '></span>
        <span className='fa fa-star '></span>
        <span className='fa fa-star '></span>
        <span className='fa fa-star'></span>
      </div>
    );
  } else if (rating >= 2 && rating < 3) {
    return (
      <div>
        <span className='fa fa-star checked'></span>
        <span className='fa fa-star  checked'></span>
        <span className='fa fa-star  '></span>
        <span className='fa fa-star  '></span>
        <span className='fa fa-star'></span>
      </div>
    );
  } else if (rating >= 3 && rating < 4) {
    return (
      <div>
        <span className='fa fa-star checked'></span>
        <span className='fa fa-star  checked'></span>
        <span className='fa fa-star checked '></span>
        <span className='fa fa-star  '></span>
        <span className='fa fa-star '></span>
      </div>
    );
  } else if (rating >= 4 && rating < 5) {
    return (
      <div>
        <span className='fa fa-star checked'></span>
        <span className='fa fa-star  checked'></span>
        <span className='fa fa-star checked '></span>
        <span className='fa fa-star  checked'></span>
        <span className='fa fa-star '></span>
      </div>
    );
  } else if (rating >= 5) {
    return (
      <div>
        <span className='fa fa-star checked'></span>
        <span className='fa fa-star  checked'></span>
        <span className='fa fa-star checked '></span>
        <span className='fa fa-star  checked'></span>
        <span className='fa fa-star checked '></span>
      </div>
    );
  } else {
    return <span>error retrieving rating</span>;
  }
};

export default Rating;
