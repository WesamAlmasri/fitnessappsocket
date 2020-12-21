let express = require("express");
let http = require("http");
let bodyParser = require("body-parser");
let path = require("path");
let cors = require("cors");



const PORT = process.env.PORT || 443;

app = express();

const server = http.createServer(app)

app.use(cors());

app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());


// Rooms
const rooms = {};


let io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


io.on("connection", (socket) => {
    console.log('a user connected');
    const userId = socket.id;

    socket.on("createRoom", (data) => {

      const username = JSON.parse(data).username;
      const roomId = CreateGuid();
      rooms[roomId] = {userId: userId, username: username};

      socket.emit("createRoom", JSON.stringify({roomId: roomId}));
    });

    socket.on("joinRoom", (data) => {
      const roomId = JSON.parse(data).roomId;
      if(rooms[roomId] !== undefined || rooms[roomId] !== null || rooms[roomId] !== ''){
        socket.join(roomId)
        payload = {
          status: "ok",
          room: rooms[roomId]
        }
      } else {
        payload = {
          status: "faild",
          room: null
        }
      }

      socket.emit("joinRoom", JSON.stringify(payload));
  });

  socket.on("sendDetails", (data) => {
    const receivedData = JSON.parse(data);
     
    if(rooms[receivedData.roomId] !== undefined || rooms[receivedData.roomId] !== null || rooms[receivedData.roomId] !== ''){
      io.to(receivedData.roomId).emmit(receivedData.data);
        payload = {
          status: "ok",
          room: rooms[roomId]
        }
    }

    socket.emit("sendDetails", JSON.stringify(payload));

  });

  socket.on('disconnect', () => {
    console.log('socket.rooms :', socket.rooms)
    console.log('user disconnected');
  });
});


server.listen(PORT, () => {console.log(`listening on *:${PORT}`)});



function CreateGuid() {  
  function _p8(s) {  
     var p = (Math.random().toString(16)+"000000000").substr(2,8);  
     return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;  
  }  
  return _p8() + _p8(true) + _p8(true) + _p8();  
}  
