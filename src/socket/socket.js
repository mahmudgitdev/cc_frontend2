import io from 'socket.io-client';
const SERVER = "localhost:5000";
export default io(SERVER, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });