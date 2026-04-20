import express from "express";
import auth from "../../middleware/auth_token.js";

const employeeRouter = express.Router();

import controller from "../../controllers/employees/new_hire_employee_info.js";

const {
    createNewEmployee,
    getEmployeeRecords,
    updateEmployeeRecord,
    deleteEmployeeRecord
} = controller;

employeeRouter.post("/", auth.requireAuth, createNewEmployee);
employeeRouter.get("/", auth.requireAuth, getEmployeeRecords);
employeeRouter.put("/:employeeID", auth.requireAuth, updateEmployeeRecord);
employeeRouter.delete("/:employeeID", auth.requireAuth, deleteEmployeeRecord);      



export default employeeRouter;


