//Components + Hooks
import { setRequestMeta } from 'next/dist/server/request-meta';
import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react';

//Libs
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const[username, setName] = useState("")
  const[roomId, setRoom] = useState("")
  const[msg, setMsg] = useState("")
  const[currentMsgs, setCurrentMsgs] = useState([])

  useEffect(() => {
    socketInitializer();
    localStorage.debug = '*';
    return () => {
      console.log("This will be logged on unmount");
    }
  }, [])

  useEffect(()=>{
    let elem = document.getElementById('msg-box');
    elem.scrollTop = elem.scrollHeight;
  }, [currentMsgs])

  const socketInitializer = async () => {
    await fetch('/api/socket',{
      method: "GET",
    });
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on("display-msg", (msgList)=>{
      setCurrentMsgs(msgList)
    })
  }

  function joinRoom(){
    socket.emit("join-room", roomId, username)
    document.getElementById("room-input").value = ""
    document.getElementById("name-input").value = ""
  }
  
  function sendMsg(){
    if(roomId!=""){
      setCurrentMsgs([...currentMsgs, {msg:msg, by:username}])
      socket.emit("send-msg", roomId, currentMsgs, {msg:msg, by:username})
      document.getElementById("msg-input").value = ""
    }  
  }

  return (
    <>
      <Head>
        <title>Live Chat App | By Hiresh</title>
        <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet' />
      </Head>
      <div className='font-poppins'>
        <h1 className='text-blue-500 mt-5 underline italic text-[50px] text-center'>Hiresh's Live Chat!</h1>
        <br />
        <div className='flex flex-wrap justify-center text-[25px]'>
          <input id="name-input" className='border-2 border-blue-500 p-2 rounded-md mx-2' placeholder='Username' required onChange={(e)=>setName(e.target.value)}/>
          <input className='border-2 border-blue-500 p-2 rounded-md mx-2' id="room-input" placeholder='Room ID' required onChange={(e)=>setRoom(e.target.value)}/>
          <button className='border-2 border-blue-500 mx-2 p-2 rounded-md' onClick={()=>joinRoom()}>Join Room</button>
        </div>
        <div className='flex justify-center flex-wrap text-[25px]'>
          <div className='my-5 bg-blue-500 rounded-md'>
            <h1 className='my-5 text-center text-white'>Room: {roomId}</h1>
            <div id="msg-box" className='h-96 min-w-fit mx-2 bg-blue-300 my-2 rounded-md overflow-auto'>
            {
              currentMsgs.map((msg, index)=>(
                <div key={index} className='rounded-md p-2 m-2 bg-blue-400'>
                  <h1 className='text-[30px]'>{msg.msg}</h1>
                  <h1 className='text-[20px]'>~{msg.by}</h1>
                </div>
              ))
            }
            </div>
            <div className='bg-blue-600 align-bottom rounded-b-md flex justify-center flex-row flex-wrap text-[25px]'>
              <input id="msg-input" className='m-2 rounded-md p-2' placeholder='Type message' onChange={(e)=>setMsg(e.target.value)} required />
              <button className='m-2 rounded-md p-2 bg-gray-400' onClick={()=>sendMsg()}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

