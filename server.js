import express from "express";
const app = express();
const PORT = 3000;
import fs from "fs";
let newHireFaculty = [];
try {
  const fileContent = fs.readFileSync("./newHireFaculty.json", "utf-8").trim();
  if(fileContent.length > 0) {
    newHireFaculty = JSON.parse(fileContent);
    console.log("RAW FILE CONTENT", fileContent);
  }
  else
  {
    console.warn("newHireFaculty.json is empty. Starting with an empty structure. ");
    newHireFaculty = [];
  }
}
catch(err) {
  console.error("Error reading or parsing newHireFaculty.json", err);
}

import path from "path";
import { fileURLToPath } from "url";


app.use(express.urlencoded({extended: true}));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join( __dirname, "views"));


app.use(express.static("public"));

function saveNewHireData() {
  fs.writeFileSync(
    "./newHireFaculty.json",
    JSON.stringify(newHireFaculty, null, 2)

  );
}

app.locals.title = "Delta Dashboard";


let sessionVisits = 0;
app.use((req, res, next) => {
  sessionVisits++;
  res.locals.sessionVisits = sessionVisits;
  next();
});

const requireKey = (req, res, next) => {
  if (req.query.key !== "delta") 
  {
    return res.status(401).render("401", {pageTitle: "Unauthorized" });
  }
  next();
};

const stampCreatedAt = (req, res, next) => {
  if(req.method == "POST")
  {
    req.createdAt = new Date().toISOString();
  }
  next();
};

app.get("/", (req, res) => {
  res.render("home", {siteTitle: "Delta Dashboard", activePage: "home"});
});


app.get("/new_hire_faculty_list", requireKey, (req, res) => {
 
  res.render("faculty_list", {siteTitle: "New Hire Faculty List" , items: newHireFaculty, activePage: "home" });
});

app.get("/campus_info", (req, res) => {
  res.render("campus_info", {siteTitle: "Campus Information",  activePage: "campus_info" });
});

app.get("/new_hire_form", (req, res) => {
  res.render("new_hire_form",  {siteTitle: "New Hire Form", activePage: "new_hire_form", newHireFaculty });
});

//Route to handle form submission
app.post("/new_hire_form", (req, res) => {
  const info =
   {name: req.body.name, 
    email:  req.body.email,
    hire_date: req.body.hire_date,
    timestamp: new Date().toLocaleString()
   } 


  //Create a new id(last id + 1)
  const newId = 
    newHireFaculty.length > 0
    ? newHireFaculty[newHireFaculty.length - 1].id + 1
    : 1;
  newHireFaculty.push({
    id: newId, 
    name: info.name,
    email: info.email,
    hire_date: info.hire_date})
    
  saveNewHireData();

  res.render("confirmation", {pageTitle: "Entry Saved", info} );

  console.log(req.body)
 
});





app.get("/welcome/:name/:timeOfDay", (req, res) => {
  const{name, timeOfDay} = req.params; //pulls the dynamic value from URL
  res.send(`<h1>Hello, ${name}!</h1><h2>Good ${timeOfDay}!</h2>\n 
    <h3>Menu</h3> \n
    <h4>What Would You Like To Do? </h4>
    <li>Find Institution Information</li><li>New Faculty List</li>\n
    <br>This will be a homepage that will give users options on where to go.`);
});
app.get("/institution/:school", (req, res) => {
  const{school} = req.params;
 

});

app.get("/institution/:school/:orgUnit/list-generator", (req, res) =>  {
  res.send(`<h2>New Hire Faculty List Generator</h2> <br>
    <h3>Description</h3>
    <p>This application generates a list of new hired faculty of Delta College within a date range.</p>
    <p> Please fill the following fields and then click 'Run' </p><br><br>
    This page will prompt the user to fill in fields for the desired report`)
});

app.get("/institution/:school/:orgUnit/list-generator/results", (req, res) => {
  res.send(`This page will display the report; consisting of names and email address of new faculty hires between desired dates`);
});

app.get("/api/new_hire_faculty_record", (req, res) => {
  res.json(newHireFaculty);
});

//simple logger
app.use((req, res, next) =>{
  console.log(`${req.method} request for ${req.url}`);
  next(); //move on t the next middleware or route
});

//timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/time", (req, res) => {
  res.send(`This request was received at ${req.requestTime}`);
});

//timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/time", (req, res) => {
  res.send(`This request was received at ${req.requestTime}`);
});

app.get("/api/new_hire_faculty_record/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const record = newHireFaculty.find(person => person.id === id);

  if(record) {
    res.json(record);
  }
  else {
    res.status(404).json({message: "Record not found"});
  }
  });


app.get("/about", (req, res) => {   
  res.sendFile(path.join(__dirname, "public", "index.html" ));
});  

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
