import express from "express";
const testingRouter = express.Router();

import controller from "../controllers/testing.js";

const{
    existing,
    regenerateSearchIds,
    resetCounter
}
= controller;

testingRouter.get("/existing", existing);
testingRouter.post("/regenerate-search-ids", regenerateSearchIds);
testingRouter.post("/reset-counter", resetCounter);

export default testingRouter;