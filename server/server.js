import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import authrouter from "./routes/authRouter.js";
import { Server } from 'socket.io';
import http from 'http';
import Message from './models/Message.js';
import User from './models/User.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import verifyToken from './verifyToken.js';
import crypto from 'crypto';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000']
    },
    pingTimeout: 60000
});

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['POST', 'GET', 'HEAD', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/api/auth', authrouter);

app.get('/api/get_room', verifyToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(404).json({ 'msg': "user not found!" });

        if (user.room == null) {
            const id = crypto.randomUUID();
            user.room = id;
            await user.save();
        }
        return res.status(200).json(user);
    } catch (err) {
        next(err);
    }
})

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went Wrong!";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

const replies = ["Ok looking into it!", "Understood, looking for results...","Here are the results : ....."];

io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('join', async (name, room) => {
        socket.join(room);
        console.log(`user with ${socket.id} ${name} joined ${room}`);

        const time_created = Date.now();
        
        io.to(room).emit('send-first', { msg: "Hi there", username: "CareBOT", time_created });
        
        setTimeout(() => {
            io.to(room).emit('send-first', { msg: `I am Wysa, an AI ChatBOT built by therapists.`, username: "CareBOT", time_created });
        }, 1000);
        
        setTimeout(() => {
            io.to(room).emit('send-first', { msg: `I am here to understand your concerns and connect you with the best resources available to support you!`, username: "CareBOT", time_created });
        }, 2000);

        setTimeout(() => {
            io.to(room).emit('send-first', { msg: `How can I help you? Mr./Mrs./Ms. ${name}`, username: "CareBOT", time_created });
        }, 3000);

        const room_messages = await Message.find({ room: room });

        setTimeout(() => {
            io.to(room).emit('receive_msg', room_messages);
        }, 4000);
    })

    socket.on('send-message', async (user, obj) => {
        const { data, image } = obj;
        const newMessage = await new Message({
            userID: user._id,
            room: user.room
        });

        if (data) newMessage.message = data;
        if (image) newMessage.extra = image;

        let room = user.room;
        await newMessage.save();

        setTimeout(() => {
            io.to(room).emit('receive_msg', { msg: newMessage, username: `${user.name}`, time_created: new Date() });
        }, 1000);
        
        const newMessage2 = new Message({
            room: user.room,
            message: replies[Math.floor(Math.random()*2)],
            isBot: true
        });

        await newMessage2.save();

        setTimeout(() => {
            io.to(room).emit('receive_msg', { msg: newMessage2, username: `CareBOT`, time_created: new Date() });
        }, 2000);

        const newMessage3 = new Message({
            room: user.room,
            message: replies[2],
            isBot: true
        });

        await newMessage3.save();

        setTimeout(() => {
            io.to(room).emit('receive_msg', { msg: newMessage3, username: `CareBOT`, time_created: new Date() });
        }, 3000);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    })
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.d8evjpw.mongodb.net/Chat`).then(() => {
    server.listen(5500, () => {
        console.log('server started in port 5500');
    })
})