import mongoose from "mongoose";

/**: 
 * Consistent JSON helpers (use these for ALL routes)
 * Success: {message: "...", data:...}
 * Error: {error: "...", details:...}
 
 */

function sendSuccess(res, message, data, status = 200) {
    return res.status(status).json({message, data});
}

function sendError(res, error, details, status = 400) {
    return res.status(status).json({error, details});
}



export const validateObjectId = (req, res, next) => {
    console.log(`Validating ObjectId for request to ${req.url}`);
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return sendError(res, "Invalid ID", `The provided ID (${req.params.id}) is not a valid MongoDB ObjectId.`, 400);
    }
    next();
}

export default validateObjectId;