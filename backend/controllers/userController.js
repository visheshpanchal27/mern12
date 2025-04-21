import asyncHandler from 'express-async-handler';
import User from '../models/userModels.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all inputs");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ username, email, password: hashedPassword });

    createToken(res, newUser._id);

    res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: "generated_token_here",
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        res.status(400);
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        res.status(400);
        throw new Error("Invalid email or password");
    }

    createToken(res, existingUser._id);

    res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        token: "generated_token_here",
    });
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password'); // Prevent sending password
    if (user) {
        return res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    res.status(404);
    throw new Error("User not found");
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {

    if (!req.user) {
        res.status(401);
        throw new Error("Not authenticated");
    }

    const user = await User.findById(req.user._id);

    if(user){
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin, 
        })
    }
    else{
      res.status(404);
      throw new Error("User not found");  
    }
})


const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if(user.isAdmin){
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({_id:user._id})
        res.json({ message: 'User deleted successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        return res.json(user);
    }else{
    res.status(404);
    throw new Error("User not found");
    }
})

const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    }else{
        res.status(404);
        throw new Error("User not found");
    }
})

export { 
    createUser, 
    loginUser, 
    logoutCurrentUser, 
    getAllUsers, 
    getCurrentUserProfile, 
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById
};
