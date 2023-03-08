require("dotenv").config({ path: "./.env" });
const express = require("express");
const connectDB = require("./config/db.config");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const app = express();

const socketIO = require("socket.io");
const auth = require("./utils/auth");

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


const io = socketIO(server, {
  transports: ["polling"],
  cors: {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("login", async (token) => {
    const tokenValidation = await auth.tokenValidation(token);
    if (tokenValidation.validation == true) {
      socket.join(tokenValidation.id);
      console.log(tokenValidation.id);
    }
  });
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log(`socket ${socket.id} disconnected`);
  });
});

const Socket = (receiver, event, data) => {
  console.log(receiver)
  io.sockets.to(receiver).emit(event, data);
};
module.exports.Socket = Socket;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
