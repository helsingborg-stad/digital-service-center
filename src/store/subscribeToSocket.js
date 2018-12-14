import io from 'socket.io-client';
import { fetchAll } from '../actions/fetchAll';

export default function (store) {
  const socket = io(window.location.origin);
  socket.on('invalid-cache', () => fetchAll(store));
}
