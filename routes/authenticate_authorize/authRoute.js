
import express from "express";
import loginRouter from "./loginRoute.js"; 
const authRouter = express.Router();

//Mount the loginRoute at /auth/login
authRouter.use("/login", loginRouter);

// Import controller functions
import  createUser from "../../controllers/authenticate_authorize/authController.js";

//Routes
authRouter.post("/", createUser);
export default authRouter;

