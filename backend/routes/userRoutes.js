import express from "express";
const router = express.Router()


import { createUser, getAllUsers, loginUser, logoutCurrentUser} from "../controllers/userController.js";
import {authenticate, authorizedAdmin} from "../middlewares/authMiddleWare.js"

router.route("/").post(createUser).get(authenticate, authorizedAdmin, getAllUsers)
router.post("/auth", loginUser)
router.post("/logout", logoutCurrentUser)

export default router 