import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import wysa_bot from '../assets/wysa_bot.png'
import anonymous from '../assets/anonymous.png'

const Container = styled.div`
    min-height: calc(100vh - 56px);
    max-width: 100vw;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(239.26deg, #DDEEED 63.17%, #FDF1E0 94.92%);
`

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    background-color: transparent;
    border: 1px solid $#fff;
    padding: 20px 50px;
    gap: 20px;
    max-width: 100vw;
`

const Bubble = styled.div`
    max-width: 50%;
    background-color: #fff;
    color: #000;
    padding: 20px 20px;
    text-align: center;
    margin-bottom: 10px;
    border-radius: 10px;
    word-wrap: break-word;
`

const Button = styled.button`
    border-radius: 3px;
    border: none;
    padding: 10px 20px;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #4ab5a7;
`

const Chat = ({ socket }) => {
    const [messages, setMessages] = useState([]);
    const [data, setData] = useState('');
    const [image, setImage] = useState('');
    const { currentUser } = useSelector(state => state.user);
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (currentUser) {
            socket.emit('join', currentUser.name, currentUser.room);

            socket.on('send-first', (obj) => {
                setMessages((prev) => {
                    return [...prev, obj];
                })
            })

            socket.on('receive_msg', (obj) => {
                if (Array.isArray(obj)) {
                    obj.forEach(o => {
                        setMessages(prev => [...prev, { msg: o }]);
                    })
                }
                else {
                    setMessages(prev => [...prev, obj])
                }
            })
        }
    }, [socket, currentUser])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const handleSubmit = () => {
        if (data !== '' && image !== '') {
            console.log(data);
            socket.emit('send-message', currentUser, { data, image });
            setData('');
            setImage('');
        }
        else if (data === '' && image !== '') {
            socket.emit('send-message', currentUser, { image });
            setImage('');
        }
        else {
            socket.emit('send-message', currentUser, { data });
            setData('');
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
            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg" || file.type === "application/pdf") {
                let base64 = await toBase64(file);
                setImage(base64);
            } else {
                alert('Unsupported File Types');
            }
        }
    }

    return (
        <Container>
            <Wrapper>
                <div className="messages" style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '30px' }}>
                    <>
                        {messages.map((message, index) => {
                            return (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                                    {(message.username && message.username === "CareBOT")
                                        ? <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '10px' }}>
                                            <img src={wysa_bot} style={{ maxWidth: '30px', maxHeight: '30px', borderRadius: '50%' }} alt="" />
                                            <Bubble key={index} style={{ alignItems: 'flex-start' }} > {message.msg}
                                            </Bubble>
                                        </div>
                                        :
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: (message.username && message.username === "CareBOT") ? 'flex-start' : 'flex-end' }}>
                                            {(message.msg?.extra) ?
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}><img style={{ maxWidth: '30%', padding: '10px' }} src={message.msg.extra} alt="" />
                                                    <img src={(currentUser?.profile && currentUser?.profile) || anonymous} style={{ maxWidth: '45px', maxHeight: '45px', borderRadius: '50%' }} alt="" />
                                                </div> : null}
                                            {(message.msg?.message) ?
                                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px' }}>
                                                    <Bubble> {message.msg.message} </Bubble>
                                                    <img src={(currentUser?.profile && currentUser?.profile) || anonymous} style={{ maxWidth: '45px', maxHeight: '45px', borderRadius: '50%' }} alt="" />
                                                </div> : null}
                                        </div>
                                    }
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </>
                </div>
                <div style={{ position: 'fixed', bottom: 0, width: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <div>
                        <input type="file" id="file" style={{ display: "none" }}
                            onChange={handleImage} />
                        <label htmlFor="file" >
                            <AttachFileIcon style={{ cursor: 'pointer' }}></AttachFileIcon>
                        </label>
                    </div>
                    <div style={{ width: '100%', margin: '10px' }}>
                        <input type="text" style={{ width: '100%', padding: '10px 10px' }} placeholder='Write a Message' value={data} onChange={(e) => setData(e.target.value)} />
                    </div>
                    <div>
                        <Button type="submit" onClick={handleSubmit}> Submit </Button>
                    </div>
                </div>
            </Wrapper>
        </Container>
    )
}

export default Chat