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
      socket.emit("getQueu", "");
    });
    socket.on("get-queu", (msg) => {
      try {
        const newQueu = JSON.parse(msg);
        setQueu(newQueu);
      } catch (e) {
        console.log("failed to convert json to array");
      }
    });
    socket.on("successful-enque", (msg) => {
      console.log(msg);
      const newQueu = JSON.parse(msg);
      console.log(typeof newQueu);
      setQueu(newQueu);
      console.log(queu);
    });
    socket.on("update-input", (msg) => {
      console.log("receiving: " + msg);
      setInput(msg);
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
