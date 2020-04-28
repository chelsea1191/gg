import axios from 'axios';
import Location from './Location';
import React, { useState, useEffect } from 'react';
import SearchDropdown from './SearchDropdown';
import Axios from 'axios';

export default function CreateUser({
  auth,
  setAuth,
  allGames,
  favoriteGames,
  setFavoriteGames,
}) {
  const [location, setLocation] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [selectedGameTypes, setSelectedGameTypes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let name = e.target[2].value.toLowerCase();
    console.log('name: ', name);
    let firstname = e.target[0].value;
    let lastname = e.target[1].value;
    let password = e.target[3].value;
    let email = e.target[4].value;
    let bio = e.target[7].value;
    let newUser = {
      username: name,
      firstname: firstname,
      lastname: lastname,
      password: password,
      email: email,
      bio: bio,
      latitude: location[0],
      longitude: location[1],
      gameTypes: selectedGameTypes,
      avatar: '/assets/avatar.png',
    };
    await axios.post('/api/createUser', newUser).then((response) => {
      newUser.id = response.data.id;
    });

    const favoriteGamesCopy = [...favoriteGames];
    const newFavoriteGame = await Axios.post('/api/favoritegames', {
      userId: newUser.id,
      gameId: filtered[0].id,
    }).data;

    setFavoriteGames([...favoriteGamesCopy, newFavoriteGame]);

    alert('Hi submitted user created');
  };

  const handleTypeSelection = (e) => {
    if (e.target.checked === true) {
      console.log('true');
      setSelectedGameTypes([...selectedGameTypes, e.target.value]);
    } else if (e.target.checked === false) {
      console.log('false');
      setSelectedGameTypes(
        selectedGameTypes.filter(
          (gameType) => gameType.value !== e.target.value
        )
      );
    }
  };

  const toLowercase = {
    textTransform: 'lowercase',
  };

  return (
    <div id="createUserPage">
      <form
        id="createUserForm"
        action="/upload"
        method="POST"
        encType="multipart/form-data"
        onSubmit={(e) => {
          console.log('form submitted');
          handleSubmit(e);
        }}
      >
        <h3>Create New User</h3>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="text" style={toLowercase} placeholder="Username" />
        <input placeholder="Password" type="password" />
        <input type="text" placeholder="Email Address" />

        <textarea
          id="bioInput"
          placeholder="Say something about yourself!"
          maxLength="300"
        />

        <Location location={location} setLocation={setLocation} />

        <h5>
          <b>What types of games do you play?</b>
        </h5>
        <div className="checkBoxes">
          <label className="checkbox" htmlFor="boardgamesCheckbox">
            <input
              type="checkbox"
              id="boardgamesCheckbox"
              name="gameTypes"
              value="Board Games"
              onChange={handleTypeSelection}
            />
            <h6>Board Games</h6>
          </label>

          <label className="checkbox" htmlFor="tabletopCheckbox">
            <input
              type="checkbox"
              id="tabletopCheckbox"
              name="gameTypes"
              value="Tabletop Games & RPGs"
              onChange={handleTypeSelection}
            />
            <h6>Tabletop Games & RPGs</h6>
          </label>

          <label className="checkbox" htmlFor="videogamesCheckbox">
            <input
              type="checkbox"
              id="videogamesCheckbox"
              name="gameTypes"
              value="Video Games"
              onChange={handleTypeSelection}
            />
            <h6>Video Games</h6>
          </label>

          <label className="checkbox" htmlFor="sportsCheckbox">
            <input
              type="checkbox"
              id="sportsCheckbox"
              name="gameTypes"
              value="Sports & Field Games"
              onChange={handleTypeSelection}
            />
            <h6>Sports & Field Games</h6>
          </label>
        </div>

        <h5>
          <b>What's your favorite game?</b>
        </h5>
        <div>
          <SearchDropdown allGames={allGames} setFiltered={setFiltered} />
        </div>
        {filtered.length > 0 && <p>game selected: {filtered[0].name}</p>}

        <h6>
          <i>Add more Favorites on the Games Page!</i>
        </h6>
        <button type="submit">
          <h5>Create User</h5>
        </button>
      </form>
    </div>
  );
}

//notes: how do we verify an email address doesnt already HAVE an account, and its a valid address? -ck
//notes: also, how do we capture a picture that a user uploads? right now the pics are not required -ck
