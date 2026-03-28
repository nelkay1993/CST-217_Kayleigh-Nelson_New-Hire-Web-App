import express from "express";
import User from "../../models/user.js";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
const loginRouter = express.Router();

/**: 
 * Consistent JSON helpers (use these for ALL routes)
 * Success: {message: "...", data:...}
 * Error: {error: "...", details:...}
 
 */

function sendSuccess(res, message, data, status = 200) {
    return res.status(status).json({message, data});
}

function sendError(res, error, details, status = 400)
{
    return res.status(status).json({error, details});
}

/**
 * POST /auth/login
 * Verify user credentials and log in
 * This route expects an email and password in the request body.
 * It checks if the user exists and if the password matches.
 * If successful, it returns a success message (and could include a token in a real app).
 * If authentication fails, it returns an error message.
 */
loginRouter.post("/", async(req, res) => {
    try {
        const {email, password } = req.body;

        //400 if required fields are missing
        if(!email || email.trim().length === 0) {
            return sendError(
                res,
                "Missing field", 
                "Email is required ( example: {\"email\": \"sample@example.com\" })", 
                400
            );
        }

        if(!password || password.trim().length === 0) {
            return sendError(
                res,
                "Missing field",
                "Password is required",  
                400
            );
        }

        const authUser = await User.findOne({email: email.trim().toLowerCase()});
        if(!authUser || !authUser.passwordHash) {
            return sendError(res, "Authentication failed", "Invalid email or password.", 401);
        }


        //bcrypt.compare(plainPassword, hash)
        const isMatch = await bcrypt.compare(password, authUser.passwordHash);
        if(!isMatch) {
            return sendError(res, "Authentication failed", "Invalid email or password.", 401);
        }

           // Token contains identity info, not the password
        const token = jwt.sign(
        { userId: authUser._id.toString(), email: authUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
        );

        return sendSuccess(res, "Login successful", {email: authUser.email, token}, 200);

    } catch (err) {
        return sendError(res, "Login failed", err.message, 500);
    }
});

export default loginRouter;