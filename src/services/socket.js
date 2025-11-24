import io from "socket.io-client";

const socket = io("https://dbad009f00d1.ngrok-free.app", {
  transports: ["websocket"],
  forceNew: true,
});

export default socket;
