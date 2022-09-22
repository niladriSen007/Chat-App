import express from "express"
import path from "path"
import http from "http"
import {Server} from "socket.io"
import Filter from "bad-words"
import {generateMessage,generateLocationMessage} from "./utils/messages.js"
import {addUser,removeUser,getUser,getUsersInRoom} from "./utils/users.js"

const app = express();

const server = http.createServer(app)
const io = new Server(server);

const __dirname = path.resolve();
const publicDirectoryPath = path.join(__dirname,"../public");

app.use(express.static(publicDirectoryPath))

const PORT  = process.env.PORT || 3000;
// app.use(express.json())

io.on('connection', (socket) => {
    console.log('a user connected');

    // socket.emit("updatedCount",count);
  socket.on("join",({userName,room},callBack)=>{

    const {error,user}=addUser({id:socket.id,userName,room})

    if(error)
    {
        return callBack(error)
    }

    socket.join(user.room)

    socket.emit("message",generateMessage(user.userName,"Welcome!"))

    //this message will be shown to all except the user who just logged in
    socket.broadcast.to(user.room).emit("message",generateMessage(`${user.userName} has joined the chat!😁`))

    // io.to(user.room).emit("roomUsersData",{
    //   room:user.room,
    //   users:getUsersInRoom(user.room)
    // })

    callBack()

  })

   

    socket.on("sendMessage",(msg,callBack)=>{

      const user = getUser(socket.id);

      const filter = new Filter()
      if(filter.isProfane(msg))
      {
        return callBack("Profinity is not allowed")
      }
      // console.log(msg);
      io.to(user.room).emit("message",generateMessage(user.userName,msg))
      // callBack("Delivered")




      callBack()
    })

    socket.on("sendLocation",({latitude,longitude},callBackLocation)=>{
      const user = getUser(socket.id);
      io.to(user.room).emit("sendLocationMessage",generateLocationMessage(user.userName,`https://google.com/maps?q=${latitude},${longitude}`))
      callBackLocation()
    })

    socket.on("disconnect",()=>{
      const user = removeUser(socket.id)

      if(user)
            io.to(user.room).emit("message",generateMessage(`${user.userName} has left`))
    })
  });

server.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})

