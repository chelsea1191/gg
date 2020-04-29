import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from 'react-router-dom';

const Dashboard = ({ auth, users }) => {
  const greentext = { color: 'rgb(0, 200, 0)' };
  const [friendsCount, setFriendsCount] = useState(0);
  const [favGamesCount, setFavGamesCount] = useState(0);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [friendships, setFriendships] = useState([]);

  useEffect(() => {
    axios.get('/api/favoritegames').then((response) => {
      setFavoriteGames(response.data);
      let filteredArray = response.data.filter((each) => {
        return each.userId === auth.id;
      });
      setFavGamesCount(filteredArray.length);
    });
  }, []);
  useEffect(() => {
    axios.get('/api/friendships').then((response) => {
      setFriendships(response.data);
      let filteredArray = response.data.filter((each) => {
        return (
          (each.userId === auth.id && each.sendStatus === 'confirmed') ||
          (each.friendId === auth.id && each.sendStatus === 'confirmed')
        );
      });
      setFriendsCount(filteredArray.length);
    });
  }, []);

  return (
    <div id='guestRestricted'>
      <div>
        <h3>Welcome back, {auth.firstname}!</h3>
      </div>

      <hr className='hr' />
      <div className='icon-container-dashboard'>
        <i className='fas fa-user-friends each-icon-dashboard'></i>
        <p>Friends: {friendsCount}</p>
      </div>
      <br />
      <div className='icon-container-dashboard'>
        <i className='fas fa-dice-d20 each-icon-dashboard'></i>
        <p>Favorited Games: {favGamesCount} </p>
      </div>
      <br />
      <hr className='hr' />
      <h5>
        <Link className='link' to='/findplayers'>
          <b style={greentext}>Find Players Near You</b>
        </Link>
      </h5>
    </div>
  );
};

export default Dashboard;
