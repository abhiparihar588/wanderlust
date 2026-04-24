const User = require("../models/user");
const jwt = require("jsonwebtoken");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

module.exports.signup = wrapAsync(async (req, res) => {
    let { username, email, password, role } = req.body;
    const newUser = new User({ email, username, role });
    
    // passport-local-mongoose register method
    const registeredUser = await User.register(newUser, password);

    // Generate JWT token
    const payload = {
        _id: registeredUser._id,
        username: registeredUser.username,
        role: registeredUser.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
        message: "User registered successfully", 
        user: { _id: registeredUser._id, username: registeredUser.username, email: registeredUser.email, role: registeredUser.role },
        token 
    });
});

module.exports.login = wrapAsync(async (req, res) => {
    // passport local authentication handles verifying the user.
    // The middleware passport.authenticate('local') should be called before this controller function if we use it, 
    // OR we can authenticate manually here since we are returning a JWT.

    // If using passport.authenticate('local') in routes:
    const user = req.user; // populated by passport

    const payload = {
        _id: user._id,
        username: user.username,
        role: user.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ 
        message: "Login successful", 
        user: { _id: user._id, username: user.username, email: user.email, role: user.role },
        token 
    });
});

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            throw new ExpressError(500, err.message);
        }
        res.status(200).json({ message: "Logout successful" });
    });
};

module.exports.getAllUsers = wrapAsync(async (req, res) => {
    const users = await User.find({}).select("-salt -hash"); // Exclude password hash details
    res.status(200).json({ users });
});

module.exports.destroyUser = wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (req.user._id === id) {
        throw new ExpressError(400, "You cannot delete yourself!");
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        throw new ExpressError(404, "User not found");
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
});
