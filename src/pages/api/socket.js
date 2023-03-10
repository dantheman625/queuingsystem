import { Server } from "socket.io";
import { enqueu, dequeu, getQueu } from "@/queu/queuingHandler";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket running");
  } else {
    console.log("Socket init");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("user connected");
      socket.on("getQueu", (msg) => {
        console.log("getQueu");
      });
      socket.on("enqueu", (msg) => {
        try {
          const queu = enqueu(msg);
          console.log("queu: " + queu);
          socket.broadcast.emit("successful-enque", JSON.stringify(queu));
        } catch (e) {
          socket.broadcast.emit("failed-enque", "fail");
        }
      });
      socket.on("dequeu", (msg) => {
        try {
          const item = dequeu();
          socket.broadcast.emit("successful-dequeu", item);
        } catch (e) {
          socket.broadcast.emit("failed-dequeu", "fail");
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
