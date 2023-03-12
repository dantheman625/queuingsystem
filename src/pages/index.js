import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
let socket;

export default function Home() {
  const [lowValueQueu, setLowValueQueu] = useState(0);
  const [midValueQueu, setMidValueQueu] = useState(0);
  const [highValueQueu, setHighValueQueu] = useState(0);

  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    let signatures = 0;
    if (data.type === "mid") signatures = 1;
    if (data.type === "high") signatures = 2;
    const input = {
      title: data.title,
      requiredSignatures: signatures,
      givenSignatures: 0,
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
      socket.emit("requestQueuSizes", "");
    });

    socket.on("getQueusSizes", (msg) => {
      try {
        const sizes = JSON.parse(msg);
        setLowValueQueu(sizes.low);
        setMidValueQueu(sizes.mid);
        setHighValueQueu(sizes.high);
      } catch (e) {
        console.log("Error while updating queu sizes");
      }
    });

    socket.on("successfulEnque", (msg) => {
      try {
        const sizes = JSON.parse(msg);
        setLowValueQueu(sizes.low);
        setMidValueQueu(sizes.mid);
        setHighValueQueu(sizes.high);
      } catch (e) {
        console.log("Error while updating queu sizes");
      }
    });
  };

  return (
    <div className="">
      <h1>Curreent Queus</h1>
      <div className="flex flex-row">
        <div className="basis-1/3">
          <h3>Low Value Queu</h3>
          <p>{lowValueQueu}</p>
        </div>
        <div className="basis-1/3">
          <h3>Mid Value Queu</h3>
          <p>{midValueQueu}</p>
        </div>
        <div className="basis-1/3">
          <h3>highValueQueu Value Queu</h3>
          <p>{highValueQueu}</p>
        </div>
      </div>
      <h1>Create new Item for the queu</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row">
          <div className="radio">
            <label>Type: </label>
            <select id="types" {...register("type", { required: true })}>
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row">
          <label>Title</label>
          <input {...register("title", { required: true })} />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
