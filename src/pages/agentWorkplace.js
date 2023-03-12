import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function Home() {
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
    socket.emit("requestCase", "");
  };

  const signOff = () => {
    if (
      currentCase.requiredSignatures === 2 &&
      currentCase.givenSignatures === 0
    ) {
      currentCase.givenSignatures += 1;
      socket.emit("enqueu", JSON.stringify(currentCase));
      setCurrentCase(null);
    } else {
      setCurrentCase(null);
    }
  };
  return (
    <>
      <h1>Work on those cases!</h1>
      <button disabled={currentCase !== null} onClick={assignCase}>
        Assign Case
      </button>
      {currentCase ? (
        <div className="flex">
          <label>{currentCase.title}</label>
          <button onClick={signOff}>Sign Case</button>
        </div>
      ) : null}
    </>
  );
}
