import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios'
import FindPlayers from '../FindPlayers'

const Chat = ({ auth }) => {
  const [chats, setChats] = useState([])
  const [friends, setFriends] = useState([])
  const [friendId, setFriendId] = useState([])
  // const [friendArray, setFriendArray] = useState([])
  var friendArray = []
  var chatsArray = []
  var friendIdArray = []

  useEffect(() => {
    axios.get(`/api/chat/${auth.id}`).then((response) => {
      response.data.map((eachresponse) => {
        if (eachresponse.creator_id != auth.id) {
          chatsArray.push({
            id: eachresponse.id,
            userid: eachresponse.creator_id,
            username: eachresponse.creator_username,
          })
        } else if (eachresponse.user_id != auth.id) {
          chatsArray.push({
            id: eachresponse.id,
            userid: eachresponse.user_id,
            username: eachresponse.user_username,
          })
        }
      })
      setChats([...chatsArray])
    })
  }, [])

  useEffect(() => {
    axios.get(`/api/friendships/${auth.id}`).then((response) => {
      console.log(response, 'these are the friends so far')
      response.data.map(async (res) => {
        if (res.userId != auth.id) {
          const response = await axios.get(`/api/user/${res.userId}`)
          friendArray.push({
            friend: response.data,
            status: res.sendStatus,
          })
        } else if (res.friendId != auth.id) {
          const response_1 = await axios.get(`/api/user/${res.friendId}`)
          friendArray.push({
            friend: response_1.data,
            status: res.sendStatus,
          })
        }
        console.log(friendArray, 'got my friendArray')
        setFriends([...friendArray])
      })
    })
  }, [])

  if (!chats || chats.length === 0) {
    return (
      <div id="chatPage">
        <h3>Chat</h3>
        <Link to="/findplayers">Find some new players to chat with!</Link>
        <div>
          Or Friends
          {friends.map((friend) => {
            if (friend.friend.id != auth.id) {
              return (
                <div key={friend.friend.id}>
                  <span>
                    <Link to={`/chat/${friend.friend.id}`}>
                      {friend.friend.username}
                      {friend.friend.isOnline ? (
                        <span className="dot-green"></span>
                      ) : (
                        <span className="dot-red"></span>
                      )}
                    </Link>
                    <div>
                      {friend.status === 'sent'
                        ? 'Friendship not confirmed yet'
                        : ''}
                    </div>
                  </span>
                </div>
              )
            }
          })}
        </div>
      </div>
    )
  } else if (chats.length > 0) {
    return (
      <div id="chatPage">
        <h3>Chat</h3>
        <hr></hr>
        Chat with a friend or continue a chat already in progress:
        {chats.map((eachChat) => {
          return (
            <div key={eachChat.id}>
              <Link to={`/chat/${eachChat.userid}`}>
                {eachChat.username}
                {friends.map((friend) => {
                  return (
                    <div>
                      {friend.friend.id === eachChat.userid ? (
                        <div>
                          {friend.friend.isOnline ? (
                            <span className="dot-green"></span>
                          ) : (
                            <span className="dot-red"></span>
                          )}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  )
                })}
              </Link>

              <hr></hr>
            </div>
          )
        })}
        Friends:
        {friends.map((friend) => {
          if (friend.friend.id != auth.id) {
            return (
              <div key={friend.friend.id}>
                <span>
                  <Link to={`/chat/${friend.friend.id}`}>
                    {friend.friend.username}
                    {friend.friend.isOnline ? (
                      <span className="dot-green"></span>
                    ) : (
                      <span className="dot-red"></span>
                    )}
                  </Link>
                  <div>
                    {friend.status === 'sent'
                      ? 'Friendship not confirmed yet'
                      : ''}
                  </div>
                </span>
              </div>
            )
          }
        })}
      </div>
    )
  } else {
    return (
      <div id="chatPage">
        <h3>Chat</h3>
        <Link to="/findplayers">Find some new players to chat with!</Link>
      </div>
    )
  }
}

export default Chat
