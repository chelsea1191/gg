import React from 'react';
import axios from 'axios';

export default function CreateUser({ auth, setAuth }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    let name = e.target[2].value;
    let firstname = e.target[0].value;
    let lastname = e.target[1].value;
    let password = e.target[3].value;
    let email = e.target[4].value;
    let bio = e.target[5].value;
    let newUser = {
      username: name,
      firstname: firstname,
      lastname: lastname,
      password: password,
      email: email,
      bio: bio,
    };
    await axios.post('/api/createUser', newUser).then((response) => {
      newUser.id = response.data.id;
    });
  };

  return (
    <div id='createUserPage'>
      <form
        id='createUserForm'
        onSubmit={(e) => {
          handleSubmit(e);
        }}>
        <h3>Create New User</h3>
        <input type='text' placeholder='First Name' />
        <input type='text' placeholder='Last Name' />
        <input type='text' placeholder='Username' />
        <input placeholder='Password' type='password' />
        <input type='text' placeholder='Email Address' />
        <textarea
          id='bioInput'
          placeholder='Say something about yourself!'
          maxLength='300'
        />

        <h5>
          <b>What types of games do you play?</b>
        </h5>
        <div className='checkBoxes'>
          <label htmlFor='boardgamesCheckbox'>
            <input
              type='checkbox'
              id='boardgamesCheckbox'
              name='gameTypes'
              value='Board Games'
            />
            <h6>Board Games</h6>
          </label>

          <label htmlFor='tabletopCheckbox'>
            <input
              type='checkbox'
              id='tabletopCheckbox'
              name='gameTypes'
              value='Tabletop Games & RPGs'
            />
            <h6>Tabletop Games & RPGs</h6>
          </label>

          <label htmlFor='videogamesCheckbox'>
            <input
              type='checkbox'
              id='videogamesCheckbox'
              name='gameTypes'
              value='Video Games'
            />
            <h6>Video Games</h6>
          </label>

          <label htmlFor='sportsCheckbox'>
            <input
              type='checkbox'
              id='sportsCheckbox'
              name='gameTypes'
              value='Sports & Field Games'
            />
            <h6>Sports & Field Games</h6>
          </label>
        </div>

        <h5>
          <b>What's your favorite game?</b>
        </h5>
        <input type='text' placeholder='Search for a Game' />
        {/*
          INPUT NEEDS AUTO-SUGGEST/COMPLETE DROPDOWN OPTIONS BASED ON ALL GAME NAMES THAT MATCH FIELD INPUT;
          */}
        <h6>
          <i>Add more Favorites on the Games Page!</i>
        </h6>
        <button>
          <h5>Create User</h5>
        </button>
      </form>
    </div>
  );
}

//notes: how do we verify an email address doesnt already HAVE an account, and its a valid address? -ck
//notes: also, how do we capture a picture that a user uploads? right now the pics are not required -ck
