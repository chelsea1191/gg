import { ChatFeed, Message } from 'react-chat-ui'
import React, { useState, useEffect } from 'react'

import axios from 'axios'
import moment from 'moment'
import * as io from 'socket.io-client'

export default function UserChat({ auth, match }) {
  var socket = io.connect()
  const messageArray = []
  const [user, setUser] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [chat, setChat] = useState([])
  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    // new Message({
    //   id: 1,
    //   message: "I'm the recipient! (The person you're talking to)",
    // }), // Gray bubble
    // new Message({ id: 0, message: "I'm you -- the blue bubble!" }), // Blue bubble
  ])

  useEffect(() => {
    axios.get(`/api/chatuser/${match.params.id}`).then((response) => {
      setUser(response.data)
    })
  }, [])

  useEffect(() => {
    if (user.id) {
      axios.get(`/api/chat/${user.id}/${auth.id}`).then((response) => {
        if (!response.data) {
          axios.post('/api/createchat', [auth.id, user.id]).then((response) => {
            setChat(response.data)
          })
        } else {
          setChat(response.data)
        }
      })
    }
  }, [user])

  useEffect(() => {
    if (chat.id) {
      console.log(chat.id, 'this is my chat in userchat')
      axios.get(`/api/getMessages/${chat.id}`).then((response) => {
        response.data.forEach((messageObj) => {
          if (messageObj.sender_id === auth.id) {
            messageArray.push(
              new Message({
                id: 0,
                message: messageObj.message,
              })
            )
          } else {
            messageArray.push(
              new Message({
                id: 1,
                message: messageObj.message,
              })
            )
          }
        })
        setMessages([...messageArray])
      })
    }
  }, [chat])

  ////SOCKET STUFF///

  socket.on('connect', function () {
    socket.emit('create', auth.id)
  })

  socket.on('chat message', (msg) => {
    const socketMessage = JSON.parse(msg)
    if (socketMessage.sender_id === auth.id) {
      setMessages([
        ...messages,
        new Message({ id: 0, message: socketMessage.message }),
      ])
    } else {
      setMessages([
        ...messages,
        new Message({
          id: 1,
          message: socketMessage.message,
        }),
      ])
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit(
      'chat message',
      JSON.stringify({
        chat_id: chat.id,
        sender_id: auth.id,
        message: message,
        time: moment(),
        typing: 'yes',
      })
    )
    setMessage('')
    setIsTyping(false)
  }

  return (
    <div id="chatPage">
      <span>
        <Link to="/chat" onClick={() => setUser('')}>
          X
        </Link>
        Chatting with: {user.firstname + user.lastname}
        <form onSubmit={handleSubmit}>
          <ChatFeed
            messages={messages} // Boolean: list of message objects
            isTyping={isTyping} // Boolean: is the recipient typing
            hasInputField={false} // Boolean: use our input, or use your own
            bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
            // JSON: Custom bubble styles
            bubbleStyles={{
              text: {
                fontSize: 30,
              },
              chatbubble: {
                borderRadius: 70,
                padding: 40,
              },
            }}
          />
          <input
            type="text"
            value={message}
            onChange={(ev) => {
              setMessage(ev.target.value)
              socket.emit('typing', () => isTyping(true))
            }}
            placeholder="message"
          />
          <button>Submit</button>
        </form>
      </span>
    </div>
  )
}
