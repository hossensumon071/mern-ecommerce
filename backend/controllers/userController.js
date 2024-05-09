import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import bcrypt from "bcryptjs";

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please fill all the inputs" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(409).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        const token = createToken(res, newUser._id);

        res.status(201).json({ token, user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        const token = createToken(res, existingUser._id);

        res.status(200).json({ token, user: existingUser });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}); 


const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: true, // Ensures cookie is sent only over HTTPS
        sameSite: "strict", // Helps mitigate CSRF attacks
        expires: new Date(0)
    });

    res.status(200).json({ message: "Logged out successfully" });
});


const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find({})
    res.json(users)
})

export { createUser, loginUser, logoutCurrentUser, getAllUsers };
