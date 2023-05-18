require("dotenv").config({ path: "./.env" });
const express = require("express");
const moment = require('moment-timezone');
const connectDB = require("./config/db.config");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const app = express();
const date = require("./utils/date");

const socketIO = require("socket.io");
const auth = require("./utils/auth");
const Schedule = require("./utils/schedule");
moment.tz.setDefault('Asia/Colombo');
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 5000;

app.options("*", cors());

const server = http.createServer(app);


const io = socketIO(server);


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    console.error()
    socket.on("login", async (token) => {
      try {
        const tokenValidation = await auth.tokenValidation(token);
        if (tokenValidation.validation == true) {
          socket.join(tokenValidation.id);
          console.log(tokenValidation.id);
          io.sockets.to(tokenValidation.id).emit("message", "Successfully joined");
        }
      } catch (error) {
        console.log(error);
        io.sockets.emit("message", error.message);
      }

    });
    socket.on("disconnect", () => {
      try {
        socket.disconnect();
        console.log(`socket ${socket.id} disconnected`);
      } catch (error) {
        console.log(error);
        io.sockets.emit("message", error.message);
      }
    });

    socket.on("connect_error", (err) => {
      try {
        console.log(`connect_error due to ${err.message}`);
        io.sockets.emit("error", error.message);
      } catch (error) {
        console.log(error);
        io.sockets.emit("message", error.message);
      } 
    });
});

const Socket = (receiver, event, data) => {
  try {
    io.sockets.to(receiver).emit(event, data);
  } catch (error) {
    console.log(error);
    io.sockets.emit("message", error.message);
  }
};
module.exports.Socket = Socket;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

Schedule.schedulePayment();


