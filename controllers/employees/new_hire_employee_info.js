import NewHireEmployee from "../../models/new_hire_employee.js";

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
 * POST: create new instance
 * Create a new item in MongoDB
*/

export const createNewEmployee = async (req, res) => {  
    try {
        const {name, emailAddress, hireDate, userAccessId} = req.body;

        const newEmployeeRecord = await NewHireEmployee.create({
            name: name, 
            emailAddress: emailAddress, 
            hireDate: hireDate,
            userAccessId: req.userAccessId
        });

        if(newEmployeeRecord.employeeID > 9999999) {
                    return sendError(
                        res, 
                        "Employee ID must be a 7 digit number",
                         "Generated employee ID is out of range", 
                         400);
                }



        return sendSuccess(res, "New hire employee record created successfully", newEmployeeRecord, 201);
     } catch(err) {
        if( err.name === "ValidationError") {
            return sendError(res, "A required field is missing or invalid", err.message, 400);
        }
        if(err.code === 11000) {
            return sendError(res, "Duplicate employee ID", "An employee with this ID already exists.", err.message, 400);
        }
        return sendError(res, "Failed to create new hire employee record", err.message, 500);
     }       
};

//GET: retrieve all authorized records; sort by most recent creation date. 
export const getEmployeeRecords = async (req, res) => {

    try {  
        
        const employeeRecords = await NewHireEmployee.find({userAccessId: req.userAccessId} ).sort({ createdAt: -1 });


        return sendSuccess(res, "Employee records retrieved successfully", employeeRecords, 200);
    } catch (err) {
        return sendError(res, "Failed to retrieve employee records", err.message, 500);
    }
};

//UPDATE: Update a NewHireEmployee by employeeID
export const updateEmployeeRecord = async (req, res) => {
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
};

//GET: Retrieve a NewHireEmployee that matches a keyword search in the name field.
//  Search should be case-insensitive and allow for partial matches.
export const searchEmployeeByName = async (req, res) => {
    try {

        const allowedFields = {"name": 1, "emailAddress": 1, "employeeID": 1, "hireDate": 0, "_id": 0};
        const filter = {userAccessId: req.userAccessId};
        
        Object.entries(req.query).forEach(([key, value]) => {
            if (value && allowedFields[key] === 1) {
                if(key === "employeeID") {
                    filter[key] = Number(value);
                }
                else {
                    filter[key] = {$regex: value, $options: "i"};
                }
            }

            if(allowedFields[key] === 0) {
                sendError(res, "Invalid search field", `The field "${key}" cannot be searched.`, 400);
            }
        });
        const results = await NewHireEmployee.find(filter, allowedFields);

         sendSuccess(res, "Search completed successfully", results, 200);   

    } catch (err) {
        sendError(res, "Failed to search employee records", err.message, 500);
    }
};


//DELETE: Delete a NewHireEmployee by employeeID
export const deleteEmployeeRecord = async (req, res) => {
    try {
        const deletedEmployeeRecords= await NewHireEmployee.findOneAndDelete({ userAccessId: req.userAccessId, employeeID: Number(req.params.employeeID)})
           
        if (!deletedEmployeeRecords) {
            return sendError(res, "Session not found", `No session found with employeeID: ${req.params.employeeID}`, 404);
        }
        sendSuccess(res, "Session updated successfully", deletedEmployeeRecords, 200);
    } catch (err) {
        sendError(res, "Failed to update session", err.message, 400);
    }
};

export default {
    createNewEmployee,
    getEmployeeRecords, 
    updateEmployeeRecord,
    searchEmployeeByName,
    deleteEmployeeRecord
};

