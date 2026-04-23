import User from "../../models/user.js";
import bcrypt from "bcrypt";

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
 * POST /auth
 * Create a new user in MongoDB
 * This is the registration route for creating new users.
 * It expects an email and password in the request body.
 * Create a new item in MongoDB
 */

const createUser = async (req, res) => {
    try {
        const {email, password } = req.body || {};

        //400 if required fields are missing
        if(!email || email.trim().length === 0) {
            return sendError(
                res,
                "Missing field", 
                "Email is required ( example: {\"email\": \"sample@example.com\" })", 
                400
            );
        }

        if(!password|| password.trim().length === 0) {
            return sendError(
                res,
                "Missing field",
                "Password is required",  
                400
            );
        }

        const existingUser = await User.findOne({email: email.trim().toLowerCase()});
        if(existingUser) {
            return sendError(res, "Email already registered", "The email is already registered.", 400);
        }

        //bcrypt.hash(password, saltRounds)

        const passwordHash = await bcrypt.hash(password, 10);



        const newUser = await User.create({
            email: email.trim().toLowerCase(),
            passwordHash: passwordHash,
        });


        return sendSuccess(res, "User created successfully", {email: newUser.email, id: newUser._id}, 201);
    } catch (err) {
        return sendError(res, "Create User failed", err.message, 500);
    }
};




export default createUser;