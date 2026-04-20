import NewHireEmployee from "../models/new_hire_employee.js";
import InstitutionInfoSession from "../models/institutional_info.js";
import Counter from "../models/counter.js";
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


//GET: NewHireEmployees- sort by largest to smallest by employeeID. 

export const existing = async (req, res) => {

     const recordsLargeToSmallEmployeeId = await NewHireEmployee.find({
    employeeID: { $gte: 1000000, $lte: 9999999 }
    }).sort({ employeeID: -1 });

    sendSuccess(res, "Employee records retrieved successfully", recordsLargeToSmallEmployeeId, 200);
};

//POST: Regenerate/Reset Counter for employeeID (for testing purposes only)

export const resetCounter = async (req, res) => {
    try {
        await Counter.updateOne({name: "employeeID"}, {$set: {seq: 1000000}}, {upsert: true});
        sendSuccess(res, "Employee ID counter reset successfully", null, 200);
    }
    catch(err) {
        sendError(res, "Failed to reset employee ID counter", err.message, 500);
    }
};

//Regenerate searchId for all sessions (for testing purposes only)
export const regenerateSearchIds = async (req, res) => {
   try {
        const sessions = await (InstitutionInfoSession.find().sort({createdAt: 1}));
        let count = 1;
        for(const session of sessions) {
            session.searchId = `delta_main_campus_${count.toString().padStart(4, "0")}`;
            await session.save();
            count++;
        }
        await Counter.updateOne({name: "searchId"}, {$set: {seq: 15}}, {upsert: true});
        sendSuccess(res, "SearchIds regenerated successfully", sessions, 200);
   }
   catch(err) {
        sendError(res, "Failed to regenerate searchIds", err.message, 500);
   }
};


export default {
    existing,
    regenerateSearchIds,
    resetCounter
};