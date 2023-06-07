import express from "express";
import {login, signup, getUser} from '../controllers/authController.js';
import verifyToken from "../verifyToken.js";

const router = express.Router();

router.post('/login',login);
router.post('/signup',signup);

router.get('/current_user',verifyToken,getUser);

router.get('/logout',verifyToken, (req,res)=>{
    res.clearCookie('access_token',{
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.end();
})

export default router;