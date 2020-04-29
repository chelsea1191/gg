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
      //console.log(response, 'these are the friends so far')
      response.data.map((res) => {
        if (res.userId != auth.id) {
          axios.get(`/api/user/${res.userId}`).then((response) => {
            console.log(response)
          })
        } else if (res.friendId != auth.id) {
          axios.get(`/api/user/${res.friendId}`).then((response) => {
            console.log(response)
          })
        }
      })
    })
    // friendIdArray.push({
    //   id: res.userId,
    //   status: res.sendStatus,
    // })
    // console.log(friendIdArray, 'friend array in if')
    // console.dir(friendIdArray)

    // console.log(friendIdArray, 'friend array in if')
    // console.dir(friendIdArray)
    // friendIdArray.push([
    //   {
    //     id: res.friendId,
    //     status: res.sendStatus,
    //   },
    // ])
    //     }
    //   })
    //   console.log(friendIdArray, 'the friends got added to this id array')
    //   console.dir(friendIdArray, 'the friends got added to this id array')
    //   setFriendId([...friendIdArray])
    // })
  }, [])

  // useEffect(() => {
  //   console.log(friendId, 'third useeffect')
  //   console.dir(friendId, 'third useeffect')
  //   friendIdArray.map((friendId) => {
  //     console.log(friendId)
  //     axios.get(`/api/user/${friendId.id}`).then((response) => {
  //       friendArray.push([
  //         {
  //           id: response.data.id,
  //           username: response.data.username,
  //           online: response.data.isOnline,
  //           status: res.sendStatus,
  //         },
  //       ])
  //     })
  //   })
  //   setFriends([...friendArray])
  //   //ß  console.log(friendArray, 'after my pushes')
  // }, [chats])

  if (!chats || chats.length === 0) {
    return (
      <div id="chatPage">
        <h3>Chat</h3>
        <Link to="/findplayers">Find some new players to chat with!</Link>
        Or Friends
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
