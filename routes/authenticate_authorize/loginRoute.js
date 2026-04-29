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

loginRouter.post("/", loginUser);
>>>>>>> 9c612d0 (Remove validateObjectId from login route)
loginRouter.post("/", loginUser);
loginRouter.get("/profile", auth.requireAuth, profile);

export default loginRouter;
