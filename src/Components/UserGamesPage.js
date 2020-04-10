import React from 'react';

const UserGamesPage = ({ user }) => {
  return (
    <div id="userGamesPage">
      <h3>{user.username}'s Favorite Games</h3>
    </div>
  );
};

export default UserGamesPage;
