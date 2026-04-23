
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import morgan from "morgan";

//Import Router

import campusRouter from "./routes/campus_buildings/institution_info_sessions.js";
import authRouter from "./routes/authenticate_authorize/authRoute.js";
import employeeRouter from "./routes/employees/new_hire_employee_info.js";
import testingRouter from "./routes/testing.js";
import middlewareController from "./middleware/logger.js";


const{
  logger, 
  timestamp,  } = middlewareController;

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(middlewareController.logger);
app.use(middlewareController.timestamp);





const PORT = process.env.PORT;

app.locals.title = "Delta Dashboard";


//MONGOOSE SETUP

//connect to MongoDB (local or Atlas connection string)
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("Connect to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {  
	console.log(`Server is running at http://localhost:${PORT}`); 
});

//Converting URL to file path

import path from "path";
import { fileURLToPath } from "url";

app.use(express.urlencoded({extended: true}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join( __dirname, "views"));



//Backend Routes 
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);
app.use("/campus_buildings", campusRouter);
app.use("/testing", testingRouter);


//UI Routes

app.get("/", (req, res) => {
  res.render("home", {siteTitle: "Delta Dashboard", activePage: "home"});
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

app.post("/new_hire_form", timestamp, async (req, res) => {
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

