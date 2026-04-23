Project Name: CST 218_Kayleigh Nelson_Delta_Dashboard_API
Author: Kayleigh Nelson
Date: 2026-03-12

Description: 
This project is designed to provide a dashboard for Delta administrators to manage campus information
includes the following:
* Campus building information
* User Creation and Authentication
* Create and store New Hire Employee Information

## What This Project Does
This is a REST API built with Express and MongoDB.
It allows users to do the following: 
 1. With jwt token, create, read, update, and delete new hire employee entries.
 2. Create, Read, Update, and Delete campus information

 ## Technology
1. Node 
2. Express
3. MongoDB

## How to Run It
1. Run npm install
2. Make sure MongoDB is running
3. Run node server.js
4. Test routes in Postman

## Evironmental Variables
1. MONGO_URI
2. JWT_SECRET
3. PORT 


## Main Routes
POST /authenticate_authorize
POST /authenticate_authorize/login
POST, GET /campus_buildings
GET /campus_buildings/:searchId
PUT, DELETE /campus_buildings/:id
POST, GET /employees (protected)
PUT, DELETE /employees/:employeeID (protected)



Run App Locally: 1. npm install, npm start

Public URL: 
