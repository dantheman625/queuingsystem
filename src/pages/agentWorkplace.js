import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const [hasCase, setHasCase] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("getCase", (msg) => {
      try {
        const receivedCase = JSON.parse(msg);
        setCurrentCase(receivedCase);
      } catch (e) {
        console.log("Error when parsing received case");
      }
    });
  };

  const assignCase = () => {
    console.log("send for case");
    setHasCase(true);
    socket.emit("requestCase", "");
  };
  return (
    <>
      <h1>Work on those cases!</h1>
      <button disabled={hasCase} onClick={assignCase}>
        Assign Case
      </button>
      {currentCase ? <label>{currentCase.title}</label> : null}
    </>
  );
}
