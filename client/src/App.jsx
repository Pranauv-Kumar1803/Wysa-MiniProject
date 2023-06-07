import React, { useEffect } from "react";
import styled from 'styled-components';
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";
import axios from './api/axiosConfig';
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./redux/userSlice";

const Container = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  background: linear-gradient(239.26deg, #DDEEED 63.17%, #FDF1E0 94.92%) 
`

const Main = styled.div`
  flex: 1;
`

const Wrapper = styled.div`
  max-width: 100vw;
`

function App({ socket }) {
  const { currentUser } = useSelector(state => state.user);
  const nav = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const func1 = async () => {
      try {
        const res = await axios.get('/auth/current_user');
        dispatch(loginSuccess(res.data.data));
      } catch (err) {
        alert('Please Login again');
        nav('/');
      }
    }
    if (!currentUser) func1();
  }, [])

  async function makeRequest()
  {
    try {
      const res = await axios.get('/get_room');
      dispatch(loginSuccess(res.data));
      nav('/chat/' + res.data.room);
    } catch (err) {
      alert('some error');
    }
  }

  useEffect(() => {
    if (currentUser !== null) {
      if(currentUser.room !== null)
      {
        nav('/chat/' + currentUser.room);
      }
      else
      {
        makeRequest();
      }
    }
  }, [currentUser])

  return (
    <Container style={{ margin: 0 }}>
      <Main>
        <Navbar></Navbar>
        <Wrapper>
          <Routes>
            <Route path="/">
              <Route index element={<Login socket={socket} />}></Route>
              <Route path="chat/:id" element={<Chat socket={socket} />}></Route>
            </Route>
          </Routes>
        </Wrapper>
      </Main>
    </Container>
  );
}

export default App;