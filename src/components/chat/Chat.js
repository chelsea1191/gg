import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios'
import FindPlayers from '../FindPlayers'

const Chat = ({ auth }) => {
  const [chats, setChats] = useState([])
  const [friends, setFriends] = useState([])
  // const [friendArray, setFriendArray] = useState([])
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
      response.data.map((res) => {
        console.log(res)
        if (res.userId != auth.id) {
          axios.get(`/api/user/${res.userId}`).then((response) => {
            setFriends([
              ...friends,
              { friend: response.data, status: res.sendStatus },
            ])
          })
        } else if (res.friendId != auth.id) {
          axios.get(`/api/user/${res.friendId}`).then((response) => {
            setFriends([
              ...friends,
              { friend: response.data, status: res.sendStatus },
            ])
          })
        }
      })

      console.log(friends, 'after my pushes')
    })
  }, [chats])

  // useEffect(() => {
  //   console.log('in useeffect three', friendArray)
  //   friendArray.map((friendid) => {
  //     console.log(friendid, 'id')
  //     axios.get(`/api/user/${friendid.userid}`).then((response) => {
  //       testFriendArray.push(response.data)
  //       console.log(testFriendArray, 'this is the friend array')
  //     })
  //   })
  //   setFriends([...testFriendArray])
  // }, [])

  if ((!chats || chats.length === 0) && friends.length === 0) {
    return (
      <div id="chatPage">
        <h3>Chat</h3>
        <Link to="/findplayers">Find some new players to chat with!</Link>
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
              <Link to={`/chat/${eachChat.userid}`}>{eachChat.username}</Link>
              {friends.map((friend) => {
                if (friend.friend.id === eachChat.userId) {
                  return (
                    <div>
                      {friend.friend.isOnline ? (
                        <span className="dot-green"></span>
                      ) : (
                        <span className="dot-red"></span>
                      )}
                    </div>
                  )
                }
              })}
              <hr></hr>
            </div>
          )
        })}
        Friends:
        {friends.map((friend) => {
          console.log(friend.friend)
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

// return (
//   <div id="chatPage">
//     <hr></hr>
//     Chat with Friends:
//     {friends.map((friend) => {
//       if (friend.id != auth.id) {
//         return (
//           <div key={friend.friendId}>
//             <span>
//               <Link to={`/chat/${friend.friendId}`}>
//                 {friend.username}
//                 {friend.isOnline ? (
//                   <span className="dot-green"></span>
//                 ) : (
//                   <span className="dot-red"></span>
//                 )}
//               </Link>
//             </span>
//           </div>
//         )
//       }
//     })}
//   </div>
// )
