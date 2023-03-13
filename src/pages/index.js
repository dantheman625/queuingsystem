import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import Heading from "@/components/Heading";
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
    <div className="grid justify-center pt-10">
      <Heading level="h2" allignment="center">
        Queus Overview
      </Heading>
      <div className="h-8"></div>
      <div className="flex flex-row space-x-10">
        <div className="basis-1/3 break-inside-avoid-column">
          <Heading level="h3" allignment="center">
            Low Value
          </Heading>
          <p className="text-center">{lowValueQueu}</p>
        </div>
        <div className="basis-1/3">
          <Heading level="h3" allignment="center">
            Mid Value
          </Heading>
          <p className="text-center">{midValueQueu}</p>
        </div>
        <div className="basis-1/3">
          <Heading level="h3" allignment="center">
            High Value
          </Heading>
          <p className="text-center">{highValueQueu}</p>
        </div>
      </div>
      <div className="h-8"></div>
      <Heading level="h2" allignment="center">
        Create new Item
      </Heading>
      <div className="h-8"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          <label className="justify-self-center">Type</label>
          <select
            id="types"
            className="col-span-2"
            {...register("type", { required: true })}
          >
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
          <label className="justify-self-center">Title</label>
          <input
            className="col-span-2"
            {...register("title", { required: true })}
          />
          <input type="submit" className="col-span-3" value="Submit" />
        </div>
      </form>
    </div>
  );
}
