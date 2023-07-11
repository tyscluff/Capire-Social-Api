import jwt from 'jsonwebtoken';

export const createJwt = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "365d" });
}; 

export const verifyJwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};