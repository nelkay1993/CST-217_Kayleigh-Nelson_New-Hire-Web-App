
import express from "express";
import {validateObjectId} from "../../middleware/validateObjectId.js";
const campusRouter = express.Router();

//Import controller functions
import controller from "../../controllers/campus_buildings/institution_info_sessions.js";

const {
    createInstitutionInfoSession, 
    getAllInstitutionInfo, 
    getOneInstitutionInfo, 
    updateInstitutionInfoSession,
    deleteInstitutionInfoSession 
    
} = controller;



//Routes
campusRouter.get("/", getAllInstitutionInfo);
campusRouter.post("/", createInstitutionInfoSession);
campusRouter.get("/:searchId", getOneInstitutionInfo);
campusRouter.put("/:id", validateObjectId,  updateInstitutionInfoSession);
campusRouter.delete("/:id", validateObjectId, deleteInstitutionInfoSession);


export default campusRouter;