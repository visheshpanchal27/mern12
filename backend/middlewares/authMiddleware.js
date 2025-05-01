import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';
import asyncHandler from './asyncHandler.js';

const authentication = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies (secure first)
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } 
  // Fallback to Authorization header
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify token hasn't been blacklisted
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    let message = 'Not authorized, token failed';
    let code = 'TOKEN_FAILED';
    
    if (error.name === 'TokenExpiredError') {
      message = 'Session expired, please login again';
      code = 'TOKEN_EXPIRED';
    }
    
    return res.status(401).json({
      success: false,
      message,
      code,
      error: error.message
    });
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin',
      code: 'ADMIN_REQUIRED'
    });
  }
};

export { authentication, authorizeAdmin };