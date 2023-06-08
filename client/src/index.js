import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from "react-router-dom";
import { io } from "socket.io-client";
let socket = io('https://Chatbot_miniProj-api.onrender.com');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App socket={socket} />
    </BrowserRouter>
  </Provider>
);