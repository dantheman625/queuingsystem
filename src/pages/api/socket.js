import { Server } from "socket.io";
import {
  enqueu,
  dequeuLowValue,
  getLowValueQueu,
  getQueusSizes,
} from "@/queu/queuingHandler";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket already running");
  } else {
    console.log("Socket initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      //get the sizes of the queus
      socket.on("requestQueuSizes", (msg) => {
        socket.emit("getQueusSizes", JSON.stringify(getQueusSizes()));
      });

      //add item to the queu
      socket.on("enqueu", (msg) => {
        try {
          enqueu(msg);
          socket.broadcast.emit(
            "successfulEnque",
            JSON.stringify(getQueusSizes())
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
