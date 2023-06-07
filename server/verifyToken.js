import jwt from "jsonwebtoken";
import { createError } from "./error.js";

const verifyToken = async (req, res, next) => {
    const token = req.cookies?.access_token;

    if (!token) return next(createError(401, 'Not authenticated'));

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
            if (err) {
                return next(createError(401, 'Invalid Token'));
            }

            req.user = user.id
        }
    )

    next();
}

export default verifyToken