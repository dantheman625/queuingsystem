import Heading from "@/components/Heading";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const [currentCase, setCurrentCase] = useState(null);
  const [agentId, setAgentId] = useState(null);

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    setAgentId(data.agentId);
  };

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
        console.log(receivedCase);
        setCurrentCase(receivedCase);
      } catch (e) {
        console.log("Error when parsing received case");
      }
    });
  };

  const assignCase = () => {
    socket.emit("requestCase", agentId);
  };

  const signOff = () => {
    if (
      currentCase.requiredSignatures === 2 &&
      (currentCase.givenSignatures.length === 0 ||
        currentCase.givenSignatures.length === undefined)
    ) {
      currentCase.givenSignatures.push(agentId);
      socket.emit("enqueu", JSON.stringify(currentCase));
      setCurrentCase(null);
    } else {
      setCurrentCase(null);
    }
  };

  const checkButton = () => {
    if (currentCase === null && agentId !== null) return false;
    return true;
  };
  return (
    <div className="container flex flex-col items-center m-10">
      <Heading level="h2" allignment="center">
        Work on those cases!
      </Heading>
      <div className="h-4"></div>
      {agentId ? (
        <p>Logged in with Id {agentId}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="placeholder:text-center"
            placeholder="Enter Agent ID"
            {...register("agentId", { required: true })}
          ></input>
          <input type="submit" value="Submit" />
        </form>
      )}

      <div className="h-4"></div>
      <button disabled={checkButton()} onClick={assignCase}>
        Assign Case
      </button>
      <div className="h-4"></div>
      {currentCase ? (
        <div className="flex flex-col items-center">
          <Heading level="h3" allignment="center">
            Current Case
          </Heading>
          <div className="h-2"></div>
          <div className="flex space-x-4">
            <p>Title: </p>
            <label>{currentCase.title}</label>
          </div>
          <button onClick={signOff}>Sign Case</button>
        </div>
      ) : null}
    </div>
  );
}
