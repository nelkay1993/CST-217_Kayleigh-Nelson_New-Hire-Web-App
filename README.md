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
It allows users to create, read, update, and delete new hire employee entries and campus information

## How to Run It
1. Run npm install
2. Make sure MongoDB is running
3. Run node server.js
4. Test routes in Postman

## Main Routes
POST /authenticate_authorize
POST /authenticate_authorize/login
POST, GET, /campus_building
GET /campus_buildings/:searchId
PUT /campus_buildings/:id
DELETE /campus_buildings/:id
POST /employees



Run App Locally: 1. npm install, npm start

Public URL: 
