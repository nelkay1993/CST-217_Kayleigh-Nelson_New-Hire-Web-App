/**
* Project: Delta Dashboard API
* Author: Kayleigh Nelson
* Date: 2026-03-12
* --------------------
* Connects to MongoDB
* Configures middleware
* Starts the Express server

* This project is designed to provide a dashboard for Delta administrators to manage campus information
* includes the following:
* Campus building information
* User Creation and Authentication
* Create and store New Hire Employee Information

*/

import { time } from "console"; 
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import auth from "./middleware/auth_token.js";

//Import Router

import campusRouter from "./routes/campus_buildings/institution_info_sessions.js";
import authRouter from "./routes/authenticate_authorize/authRoute.js";
import employeeRouter from "./routes/employees/new_hire_employee_info.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.locals.title = "Delta Dashboard";

// Helper function to keep responses consistent
function ok(res, message, data = null) {
  return res.status(200).json({ message, data });
}



//MONGOOSE SETUP

//connect to MongoDB (local or Atlas connection string)
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("Connect to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));



//Converting URL to file path

import path from "path";
import { fileURLToPath } from "url";

app.use(express.urlencoded({extended: true}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join( __dirname, "views"));


app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next(); //move on to the next middleware or route
});


//timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toLocaleString();
  console.log("Request Time:", req.requestTime);
  next();
});


const stampCreatedAt = (req, res, next) => {
  if(req.method == "POST")
  {
    req.createdAt = new Date().toISOString();
    console.log("Created At:", req.createdAt);
  }
  next();
};


//Routes 
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);
app.use("/campus_buildings", campusRouter);

app.get("/", (req, res) => {
  res.render("home", {siteTitle: "Delta Dashboard", activePage: "home"});
});

//Authentication Confirmation Route
app.get("/profile", auth.requireAuth, async (req, res) => {
  // At this point, middleware already verified token
  return ok(res, "You are authenticated", { userId: req.userId, email: req.email });
});


app.get("/new_hire_faculty_list", (req, res) => {
 
  res.render("faculty_list", {siteTitle: "New Hire Faculty List" , items: newHireFaculty, activePage: "home" });

});

app.get("/campus_info", (req, res) => {
  res.render("campus_info", {siteTitle: "Campus Information",  activePage: "campus_info" });
});

app.get("/new_hire_form", (req, res) => {
  res.render("new_hire_form",  {siteTitle: "New Hire Form", activePage: "new_hire_form", newHireFaculty });
  res.render("confirmation", {pageTitle: "Entry Saved", info} );
  console.log(req.body, "Time of Entry: ", info.timestamp);

});

app.post("/new_hire_form", stampCreatedAt, async (req, res) => {
  const newHireEmployee = await newHireEmployee.create(req.body);
  res.render("confirmation", {pageTitle: "Entry Saved", info} );
  console.log(req.body, "Time of Entry: ", req.createdAt);

});


//Error Routes 

app.get("/trigger-500", (req, res, next) => {
  next(new Error("Intentional test error"));
});

app.use((req, res) => {
  res.status(404).render("404", {pageTitle: "Not Found", url: req.originalUrl});

});

app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  const status = err.status || 500
  console.log("NODE_ENV =", process.env.NODE_ENV);

  //Minimal logging

  console.error(`[ERROR] ${status} ${req.method} ${req.url})`, err.message);

  res.status(status).render("500", {
    pageTitle: "Server Error", 
    message: isProd ? "Something went wrong." : (err.message || "Error"),
    stack: isProd ? null : err.stack
  });
});


app.listen(PORT, () => {  
	console.log(`Server is running at http://localhost:${PORT}`); 
});