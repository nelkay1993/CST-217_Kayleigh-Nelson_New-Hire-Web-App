
import express from "express";
const campusRouter = express.Router();
import InstitutionInfoSession from "../../models/institutional_info.js";



function sendSuccess(res, message, data, status = 200) {
    return res.status(status).json({message, data});
}

function sendError(res, error, details, status = 400)
{
    return res.status(status).json({error, details});
}

//POST: create new session

campusRouter.post("/", async (req, res) => {
    try {
        const newSession = new InstitutionInfoSession(req.body);
        const savedSession = await newSession.save();
        res.status(201).json(savedSession);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//GET: retrieve all sessions
campusRouter.get("/", async (req, res) => {
    try {
        const sessions = await InstitutionInfoSession.find().sort({ createdAt: -1 });
        sendSuccess(res, "Sessions retrieved successfully", sessions, 200);
    } catch (err) {
        sendError(res, "Failed to retrieve sessions", err.message, 500);
       
    }   
});

//GET: Get one InstitutionInfoSession by searchId
campusRouter.get("/:searchId", async (req, res) => {
    try {
        const session = await InstitutionInfoSession.findOne({ searchId: req.params.searchId });  
        if (!session) {
            sendError(res, "Session not found", `No session found with searchId: ${req.params.searchId}`, 404);
        }
        sendSuccess(res, "Session retrieved successfully", session, 200);
    } catch (err) {
        sendError(res, "Failed to retrieve session", err.message, 500);
    }
});

//UPDATE: Update a session by ID
campusRouter.put("/:id", async (req, res) => {
    try {
        const updatedSession = await InstitutionInfoSession.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedSession) {
            return sendError(res, "Session not found", `No session found with ID: ${req.params.id}`, 404);
        }
        sendSuccess(res, "Session updated successfully", updatedSession, 200);
    } catch (err) {
        sendError(res, "Failed to update session", err.message, 400);
    }
});

//DELETE: omit a session by id

campusRouter.delete("/:id", async (req, res) => {
    try {
        const deletedSession = await InstitutionInfoSession.findByIdAndDelete(req.params.id);
        if (!deletedSession) {
            return sendError(res, "Session not found", `No session found with ID: ${req.params.id}`, 404);
        }
        sendSuccess(res, "Session deleted successfully", null, 200);
    } catch (err) {
        sendError(res, "Failed to delete session", err.message, 500);
    }
});

export default campusRouter;