import axios from 'axios';
import Location from './Location';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
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
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [matches, setMatches] = useState(false);
  const link = 'createUser';
  const notifySuccess = () => {
    toast.success('Success! User created', {
      className: 'createUserToastSuccess',
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: false,
    });
  };
  const notifyPassDontMatch = () => {
    toast.success('Passwords do not match- please try again', {
      className: 'createUserToastFailure',
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: false,
    });
  };
  const notifyFailure = () => {
    toast.success(
      'Username or email is not unique- please try again with another username and email',
      {
        className: 'createUserToastFailure',
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: false,
      }
    );
  };
  const notifyIncomplete = () => {
    toast.success('Form is not complete', {
      className: 'createUserToastFailure',
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: false,
    });
  };

  const [selectedGameTypes, setSelectedGameTypes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.dir(e.target);
    if (matches) {
      let name = e.target[2].value.toLowerCase();
      let firstname = e.target[0].value;
      let lastname = e.target[1].value;
      let password = e.target[3].value;
      let email = e.target[5].value;
      let bio = e.target[6].value;
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
      if (newUser.id) {
        const favoriteGamesCopy = [...favoriteGames];
        const newFavoriteGame = await Axios.post('/api/favoritegames', {
          userId: newUser.id,
          gameId: filtered[0].id,
        }).data;
        setFavoriteGames([...favoriteGamesCopy, newFavoriteGame]);
        // alert('Hi submitted user created');
        notifySuccess();
      } else {
        notifyFailure();
      }
    } else {
      notifyPassDontMatch();
    }
  };
  const checkIfAllComplete = (e) => {
    e.preventDefault();

    if (
      e.target[0].value &&
      e.target[1].value &&
      e.target[2].value &&
      e.target[3].value &&
      e.target[4].value &&
      e.target[5].value &&
      e.target[6].value &&
      e.target[11].value &&
      location.length > 0
    ) {
      return true;
    } else {
      notifyIncomplete();
      return false;
    }
  };

  const handleTypeSelection = (e) => {
    if (e.target.checked === true) {
      setSelectedGameTypes([...selectedGameTypes, e.target.value]);
    } else if (e.target.checked === false) {
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
        //action='/upload'
        method="POST"
        encType="multipart/form-data"
        onSubmit={(e) => {
          let result = checkIfAllComplete(e);
          if (result) {
            handleSubmit(e);
          }
        }}
      >
        <h3>Create Account</h3>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="text" style={toLowercase} placeholder="Username" />
        <input
          value={password1}
          placeholder="Password"
          type="password"
          onChange={(ev) => setPassword1(ev.target.value)}
        />
        <input
          value={password2}
          placeholder="Confirm Password"
          type="password"
          onChange={(ev) => {
            setPassword2(ev.target.value);
            if (ev.target.value === password1) {
              setMatches(true);
            } else {
              setMatches(false);
            }
          }}
        />
        {!matches && password2 && (
          <p className="passFail">passwords do not match</p>
        )}
        {matches && <p className="passSuccess">passwords match</p>}
        <input type="text" placeholder="Email Address" />

        <textarea
          id="bioInput"
          placeholder="Say something about yourself!"
          maxLength="300"
        />
        <hr className="hr" />
        <Location location={location} setLocation={setLocation} />
        <hr className="hr" />
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
        <hr className="hr" />
        <h5>
          <b>What's your favorite game?</b>
        </h5>
        <div id="dropdownDiv">
          <SearchDropdown
            auth={auth}
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
        <hr className="hr" />
        <button type="submit" id="createUserButton">
          <h5>Create User</h5>
        </button>
        <ToastContainer closeButton={false} />

        <i>
          Remember to Upload a Photo on the User Settings Page!{' '}
          <img
            src="/assets/settings.png"
            alt=""
            width="16"
            height="16"
            title="Settings"
          ></img>
        </i>
      </form>
    </div>
  );
}
