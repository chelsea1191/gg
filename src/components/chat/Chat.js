import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios'
import FindPlayers from '../FindPlayers'

const Chat = ({ auth, users, friendships }) => {
  const [chats, setChats] = useState([])
  const [friends, setFriends] = useState([])
  var friendArray = []

  //search for existing chats if theres are none create one!
  useEffect(() => {
    axios.get(`/api/chat/${auth.id}`).then((response) => {
      setChats(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`/api/friendships/${auth.id}`).then((response) => {
      console.log(response.data)
      setFriends(response.data)
    })
  }, [])

  useEffect(() => {
    friendships.map((friendship) => {
      console.log(friendship, 'the friendship stuff')
      axios.get(`/api/chat/${friendship.friendId}`).then((response) => {
        friendArray.push(response.data)
      })
      setFriends(friendArray)
    })
  }, [])

  if ((!chats || chats.length === 0) && friends.length === 0) {
    return (
      <div id="chatPage">
        <h3>Chat</h3>

        <Link to="/findplayers">Find some new players to chat with!</Link>
      </div>
    )
  } else {
    return (
      <div id="chatPage">
        <h3>Chat</h3>
        Continue a chat already in progress:
        {chats.map((eachChat) => {
          return (
            <div key={eachChat.id}>
              {users.map((eachUser) => {
                if (eachChat.user_id === eachUser.id) {
                  return (
                    <div key={eachUser.id}>
                      <Link to={`/chat/${eachUser.id}`}>
                        {eachUser.username}
                      </Link>
                      <hr></hr>
                    </div>
                  )
                }
              })}
              Chat with Friends
              <hr></hr>
              <Link to="/findplayers">
                {' '}
                Find some new players to chat with!
              </Link>
              {friends.map((friend) => {
                if (friend.id != auth.id) {
                  return (
                    <div key={friend.friendId}>
                      <span>
                        <Link to={`/chat/${friend.friendId}`}>
                          {friend.username}
                        </Link>
                      </span>
                    </div>
                  )
                }
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default Chat
