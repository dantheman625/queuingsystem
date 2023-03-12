import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
let socket;

export default function Home() {
  const [queu, setQueu] = useState([]);

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    const input = {
      title: data.title,
    };
    const jsonInput = JSON.stringify(input);
    socket.emit("enqueu", jsonInput);
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
      //after connection get the current low value queu
      socket.emit("requestLowValueQue", "");
    });

    socket.on("getLowValueQue", (msg) => {
      try {
        const newLowValueQueu = JSON.parse(msg);
        setQueu(newLowValueQueu);
      } catch (e) {
        console.log("Error when receiving current low value queu");
      }
    });

    socket.on("successfulLowValueEnque", (msg) => {
      const newLowValueQueu = JSON.parse(msg);
      setQueu(newLowValueQueu);
    });
  };

  return (
    <>
      <h1>Current Queu</h1>
      <ul>
        {queu.map((item, i) => {
          return <li key={i}>{item.title}</li>;
        })}
      </ul>
      <h1>Create new Item for the queu</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Title</label>
        <input placeholder="Title" {...register("title", { required: true })} />
        <input type="submit" />
      </form>
    </>
  );
}
