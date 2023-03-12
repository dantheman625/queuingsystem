import { Server } from "socket.io";
import {
  enqueuLowValue,
  dequeuLowValue,
  getLowValueQueu,
} from "@/queu/queuingHandler";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket already running");
  } else {
    console.log("Socket initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      //low value queu oprations

      //get the current low value queu
      socket.on("requestLowValueQue", (msg) => {
        const lowValueQueu = getLowValueQueu();
        socket.broadcast.emit("getLowValueQue", JSON.stringify(lowValueQueu));
      });

      //add an item to the low value queu
      socket.on("enqueu", (msg) => {
        try {
          const queu = enqueuLowValue(msg);
          socket.broadcast.emit(
            "successfulLowValueEnque",
            JSON.stringify(queu)
          );
        } catch (e) {
          socket.broadcast.emit("failed-enque", "fail");
        }
      });

      //case assignment to client
      socket.on("requestCase", (msg) => {
        const item = dequeuLowValue();
        if (item === null) {
          socket.emit("noCaseToAssign", JSON.stringify(item));
        } else {
          //send the case only to the sender
          socket.emit("getCase", JSON.stringify(item));
          //broadcast the change of the queu to all
          socket.broadcast.emit(
            "getLowValueQue",
            JSON.stringify(getLowValueQueu())
          );
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
