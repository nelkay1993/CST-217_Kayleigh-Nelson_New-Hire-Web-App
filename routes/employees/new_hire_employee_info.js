import express from "express";
import NewHireEmployee from "../../models/new_hire_employee.js";
import auth from "../../middleware/auth_token.js";
const employeeRouter = express.Router();


function sendSuccess(res, message, data, status = 200) {
    return res.status(status).json({message, data});
}

function sendError(res, error, details, status = 400)
{
    return res.status(status).json({error, details});
}


/**
 * POST: create new instance
 * Create a new item in MongoDB
*/

employeeRouter.post("/", auth.requireAuth, async (req, res) => {  
    try {
        const {name, emailAddress, hireDate, userAccessId} = req.body;

        const newEmployeeRecord = await NewHireEmployee.create({
            name: name, 
            emailAddress: emailAddress, 
            hireDate: hireDate,
            userAccessId: req.userAccessId
        });


        return sendSuccess(res, "New hire employee record created successfully", newEmployeeRecord, 201);
     } catch(err) {
        if( err.name === "ValidationError") {
            return sendError(res, "A required field is missing or invalid", err.message, 400);
        }
        return sendError(res, "Failed to create new hire employee record", err.message, 500);
     }       
});

//GET: retrieve all authorized records; sort by most recent creation date. 
employeeRouter.get("/", auth.requireAuth,  async (req, res) => {

    try {  
        
        const employeeRecords = await NewHireEmployee.find({userAccessId: req.userAccessId} ).sort({ createdAt: -1 });


        return sendSuccess(res, "Employee records retrieved successfully", employeeRecords, 200);
    } catch (err) {
        return sendError(res, "Failed to retrieve employee records", err.message, 500);
    }
});

//UPDATE: Update a NewHireEmployee by employeeID
employeeRouter.put("/:employeeID", auth.requireAuth, async (req, res) => {
    try {
        const employeeRecord= await NewHireEmployee.findOne({ employeeID: Number(req.params.employeeID)});  

        if(!employeeRecord) {
            return sendError(res, "Session not found", `No session found with employeeID: ${req.params.employeeID}`, 404);
        }
        if(employeeRecord.userAccessId.toString() !== req.userAccessId) {
            return sendError(res, "Forbidden", "You do not have access to this record", 403);

        }

        const allowedUpdates = ["name", "emailAddress"];

        allowedUpdates.forEach(field => {
            if(req.body[field] != undefined) {
                employeeRecord[field] = req.body[field];

            }
        });
        await employeeRecord.save();

        sendSuccess(res, "Session updated successfully", employeeRecord, 200);
    } catch (err) {
        sendError(res, "Failed to update session", err.message, 400);
    }
});


//DELETE: Delete a NewHireEmployee by employeeID
employeeRouter.delete("/:employeeID", auth.requireAuth, async (req, res) => {
    try {
        const deletedEmployeeRecords= await NewHireEmployee.findOneAndDelete({ userAccessId: req.userAccessId, employeeID: Number(req.params.employeeID)})
           
        if (!deletedEmployeeRecords) {
            return sendError(res, "Session not found", `No session found with employeeID: ${req.params.employeeID}`, 404);
        }
        sendSuccess(res, "Session updated successfully", deletedEmployeeRecords, 200);
    } catch (err) {
        sendError(res, "Failed to update session", err.message, 400);
    }
});



export default employeeRouter;


