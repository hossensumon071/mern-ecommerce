import asyncHandler from "../middlewares/asyncHandler.js"
import User from "../models/userModel.js"

const createUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body

    if(!username || !email || !password) {
        throw new Error("please fill all the inputs")
    }

    const userExists = await User.findOne({email})
    if(userExists) res.status(400).send("User already exists")

    const newUser = new User({username, email, password})

    try{
        await newUser.save()

        res
        .status(201)
        .json(newUser)
    } catch(err) {
        res.status(400)
        throw new Error("Invalid User Data")
    }
})

export {createUser}