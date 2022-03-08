import io from 'socket.io-client';
const SERVER = "http://champion-be.mpg.saz-zad.com";
export default io(SERVER, {
    extraHeaders: {
      "my-custom-header": "abcd"
    }
  });