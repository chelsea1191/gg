import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios'
import FindPlayers from '../FindPlayers'

const Chat = ({ auth }) => {
  const [chats, setChats] = useState([])
  const [friends, setFriends] = useState([])
  var friendIdArray = []
  var friendArray = []
  var chatsArray = []

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
      if (response.data.length > 1) {
        response.data.map((res) => {
          //     console.log(res)
          if (res.userId != auth.id) {
            friendIdArray.push({
              userid: res.userId,
              status: res.status,
            })
          } else if (res.friendId != auth.id) {
            friendIdArray.push({
              userid: res.friendId,
              status: res.status,
            })
          }
        })
      } else {
        friendIdArray.push({
          userid: response.data.id,
        })
      }
    })
    setFriends([...friendIdArray])
  }, [])

  // useEffect(() => {
  //   if (friends) {
  //     console.log('in useeffect three', friends)
  //     friendIdArray.map((friendid) => {
  //       console.log(friendid, 'id')
  //       axios.get(`/api/user/${friendid.userid}`).then((response) => {
  //         friendArray.push(response.data)
  //         console.log(friendArray, 'this is the friend array')
  //       })
  //     })
  //     setFriends([...friendArray])
  //   }
  // }, [])

  if ((!chats || chats.length === 0) && friends.length === 0) {
    return (
      <div id="chatPage">
        <h3>Chat</h3>
        <Link to="/findplayers">Find some new players to chat with!</Link>
      </div>
    )
  } else if (chats.length > 0) {
    // console.log('chats: ', chats)
    return (
      <div id="chatPage">
        <h3>Chat</h3>
        <hr></hr>
        Chat with a friend or continue a chat already in progress:
        {chats.map((eachChat) => {
          //   console.log('eachChat: ', eachChat)
          return (
            <div key={eachChat.id}>
              <Link to={`/chat/${eachChat.userid}`}>{eachChat.username}</Link>
              {/* {friends.map((friend) => {
                if (friend.id === eachChat.userId) {
                  return (
                    <div>
                      {friend.isOnline ? (
                        <span className="dot-green"></span>
                      ) : (
                        <span className="dot-red"></span>
                      )}
                    </div>
                  );
                }
              })} */}
              <hr></hr>
            </div>
          )
        })}
        {friends.map((friend) => {
          if (friend.id != auth.id) {
            return (
              <div key={friend.friendId}>
                <span>
                  <Link to={`/chat/${friend.friendId}`}>
                    {friend.username}
                    {friend.isOnline ? (
                      <span className="dot-green"></span>
                    ) : (
                      <span className="dot-red"></span>
                    )}
                  </Link>
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
        <hr></hr>
        Chat with Friends:
        {friends.map((friend) => {
          if (friend.id != auth.id) {
            return (
              <div key={friend.friendId}>
                <span>
                  <Link to={`/chat/${friend.friendId}`}>
                    {friend.username}
                    {friend.isOnline ? (
                      <span className="dot-green"></span>
                    ) : (
                      <span className="dot-red"></span>
                    )}
                  </Link>
                </span>
              </div>
            )
          }
        })}
      </div>
    )
  }
}

export default Chat
