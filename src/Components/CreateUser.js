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
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}>
        <h1>Create New User</h1>
        <input placeholder='First Name' />
        <input placeholder='Last Name' />
        <input placeholder='Username' />
        <input placeholder='Password' type='password' />
        <input placeholder='Email Address' />
        <input
          placeholder='Bio (max 300 characters)'
          type='text'
          maxlength='300'
        />
        <button>Create User</button>
      </form>
    </div>
  );
}

//notes: how do we verify an email address doesnt already HAVE an account, and its a valid address? -ck
//notes: also, how do we capture a picture that a user uploads? right now the pics are not required -ck
