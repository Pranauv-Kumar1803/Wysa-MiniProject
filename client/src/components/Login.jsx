import axios from '../api/axiosConfig'
import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginError, loginStart, loginSuccess } from '../redux/userSlice'

const Container = styled.div`
    min-height: calc(100vh - 56px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    background: linear-gradient(239.26deg, #DDEEED 63.17%, #FDF1E0 94.92%) 
`

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #52a1ad;
    border: 1px solid $#fff;
    border-radius: 5px;
    padding: 20px 50px;
    gap: 20px;
    color: #fff;
`

const Title = styled.h1`
    font-size: 24px;
`
const SubTitle = styled.h2`
    font-size: 16px;
    font-weight: 400;
`

const Input = styled.input`
    border: 1px solid #000;
    background-color: transparent;
    border-radius: 5px;
    padding: 10px;
    width: 100%;
    color: #fff;
`

const Button = styled.button`
    border-radius: 3px;
    border: none;
    padding: 10px 20px;
    font-weight: 500;
    cursor: pointer;
    background-color: #fff;
    color: #000
`

const Login = ({ socket }) => {
    const [data, setData] = useState({ name: '', email: '', password: '', image: '' });
    const [login, setLogin] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user)

    function handleChange1(e) {
        const name = e.target.name;
        const value = e.target.value;

        setLogin(prev => {
            return { ...prev, [name]: value };
        })
    }

    function handleChange2(e) {
        const name = e.target.name;
        const value = e.target.value;

        setData(prev => {
            return { ...prev, [name]: value };
        })
    }

    async function handleLogin(e) {
        dispatch(loginStart())
        try {
            const res = await axios.post('/auth/login', login);
            dispatch(loginSuccess(res.data));
            alert('login successful');
        } catch (err) {
            alert(err.message);
            dispatch(loginError());
            window.location.reload();
        }
    }

    async function handleRegister(e) {
        try {
            const res = await axios.post('/auth/signup', data);
            alert('sign up successful');
            window.location.reload();
        } catch (err) {
            alert(err.message);
            window.location.reload();
        }
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleImage = async (e) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") {
                let base64 = await toBase64(file);
                setData(prev=>{
                    return {...prev, [e.target.name]:base64}
                })
            } else {
                alert('Unsupported Types');
            }
        }
    }

    return (
        <Container>
            {!currentUser ?
                <Wrapper>
                    <Title>Login</Title>
                    <SubTitle>to continue to Chat</SubTitle>
                    <Input type='text' placeholder='email' name='email' value={login.email} onChange={handleChange1} />
                    <Input type='password' placeholder='password' name='password' value={login.password} onChange={handleChange1} />
                    <Button onClick={handleLogin}>Log In</Button>

                    <Title>Or SignUp</Title>

                    <Input type='text' placeholder='username' name='name' value={data.name} onChange={handleChange2} />
                    <Input type='email' placeholder='email' name='email' value={data.email} onChange={handleChange2} />
                    <Input type='password' placeholder='password' name='password' value={data.password} onChange={handleChange2} />
                    <label htmlFor="file">Profile Picture</label>
                    <Input type='file' id='file' name='image' placeholder='profile pic' onChange={handleImage} />
                    <Button onClick={handleRegister}>Sign up</Button>
                </Wrapper>
                : 
                <Wrapper>
                    <Link to={`/chat/${currentUser?.room}`} >
                        <Button> Continue To Your Chat! </Button>
                    </Link>
                </Wrapper>
                }
        </Container>
    )
}

export default Login;