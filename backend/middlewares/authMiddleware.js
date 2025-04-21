import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import asyncHandler from './asyncHandler.js';

const authentication = asyncHandler(async (req, res, next) => {
    let token;
    
    token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, Token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, No token provided');
    }
});

const authorizeAdmin = (req, res, next) => { 
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send('Unauthorized, You are not an admin');
    }
};

export { authentication, authorizeAdmin };
