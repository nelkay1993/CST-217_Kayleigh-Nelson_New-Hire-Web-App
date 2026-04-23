import express from "express";
import validateObjectId from "../../middleware/validateObjectId.js";
const loginRouter = express.Router();
import auth from "../../middleware/auth_token.js";

//Import controller functions
import controller from "../../controllers/authenticate_authorize/loginController.js";
const {
    loginUser,
    profile
} = controller;

//Routes
loginRouter.post("/", auth.requireAuth, loginUser);
loginRouter.get("/profile", auth.requireAuth, profile);

export default loginRouter;
