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
  const link = 'createUser';

  const [selectedGameTypes, setSelectedGameTypes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target[3].value === e.target[4].value) {
      let name = e.target[2].value.toLowerCase();
      let firstname = e.target[0].value;
      let lastname = e.target[1].value;
      let password = e.target[3].value;
      let email = e.target[5].value;
      let bio = e.target[8].value;
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
      await axios
        .post('/api/createUser', newUser)
        .then((response) => {
          newUser.id = response.data.id;
        })
        .catch((err) => console.log(err));

      const favoriteGamesCopy = [...favoriteGames];
      console.log('newUserId: ', newUser.id);
      const newFavoriteGame = await Axios.post('/api/favoritegames', {
        userId: newUser.id,
        gameId: filtered[0].id,
      }).data;
      setFavoriteGames([...favoriteGamesCopy, newFavoriteGame]);
      alert('Hi submitted user created');
    } else {
      alert('password does not match');
    }
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
          handleSubmit(e);
        }}
      >
        <h3>Create New User</h3>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="text" style={toLowercase} placeholder="Username" />
        <input placeholder="Password" type="password" />
        <input placeholder="Confirm Password" type="password" />
        <input type="text" placeholder="Email Address" />
        <div
          id="imageUploadForm"
          // action="/upload"
          // method="POST"
          // encType="multipart/form-data"
        >
          <h5>
            <b>Add a Profile Picture</b>
          </h5>
          <input type="file" name="imageToUpload" id="imageToUpload" />
          <input
            type="submit"
            value="upload"
            name="submitImage"
            onClick={console.log('file submit clicked')}
          />
        </div>

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

          <label className="checkbox" htmlFor="cardgamesCheckbox">
            <input
              type="checkbox"
              id="cardgamesCheckbox"
              name="gameTypes"
              value="Trading Card Games"
              onChange={handleTypeSelection}
            />
            <h6>Trading Card Games</h6>
          </label>
        </div>

        <h5>
          <b>What's your favorite game?</b>
        </h5>
        <div id="dropdownDiv">
          <SearchDropdown
            link={link}
            allGames={allGames}
            setFiltered={setFiltered}
          />
        </div>
        {filtered.length > 0 && (
          <p>great choice! you have selected: {filtered[0].name}</p>
        )}
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
//there is an email validation npm package that validates it's an actual email- for now we don't use emails for anything so it's not necessary
