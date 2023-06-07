import React from 'react'
import styled from 'styled-components'
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice'
import axios from '../api/axiosConfig';
import anonymous from '../assets/anonymous.png';

const Container = styled.div`
  position: sticky;
  top: 0;
  max-width: 100vw;
  background-color: transparent;
  height: 56px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
`

const Wrapper2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding: 0px 20px;
`

const Title = styled.h1`
  font-size: 24px;
  color: #46b9a5;
`

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #4ab5a7;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px; 
  text-decoration: none;
`

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
`

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`

const Navbar = () => {
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      dispatch(logout());
      const res = await axios.get('/auth/logout');
      alert('Logout successful');
      await navigate('/');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <Container>
        <Wrapper2>
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <Title>CareBOT</Title>
          </Link>
        </Wrapper2>

        <Wrapper>
          {currentUser ?
            <User>
              <Avatar src={currentUser.profile || anonymous} />
              {currentUser.name.split(' ').length >= 2 ? currentUser.name.split(' ')[0] : currentUser.name}
              <Button onClick={handleLogout}>Logout</Button>
            </User>
            : <Link to={'/'} style={{ textDecoration: 'none' }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          }
        </Wrapper>
      </Container>
    </>
  )
}

export default Navbar