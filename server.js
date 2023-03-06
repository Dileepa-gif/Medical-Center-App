require("dotenv").config({ path: "./.env" });
const express = require("express");
const connectDB = require("./config/db.config");
const bodyParser = require("body-parser");
const cors = require("cors");


const { Server } = require("socket.io");

const app = express();


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





app.options('*', cors());


async function server() {
  const http = require("http").createServer(app);
  const io = new Server(http, { transports: ["websocket"] });
  const roomName = "dogfoot";
  io.on("connection", (socket) => {
    socket.on("join", () => {
      socket.join(roomName);
      socket.to(roomName).emit("joined");
    });
    socket.on("offer", (offer) => {
      socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer) => {
      socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice) => {
      socket.to(roomName).emit("ice", ice);
    });
  });
http.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
}
server();


