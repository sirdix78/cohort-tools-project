const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cohorts = require("./api/cohorts.json");
const students = require("./api/students.json");
const cors = require("cors");
const mongoose = require("mongoose"); // Connecting to the Database
const Cohorts = require("./models/cohorts.model");
const Students = require("./models/students.model");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
  return;
});

app.get("/api/cohorts", (req, res) => {
  Cohorts.find()
    .then(allCohorts => {
      res.status(200).json(allCohorts);
      return;
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error retrieving cohorts", error });
      return;
    });
});

app.get("/api/students", (req, res) => {
  Students.find()
    .then(allStudents => {
      res.status(200).json(allStudents);
      return;
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "Error retrieving students", error });
      return;
    });
});

// START SERVER // never have a return inside the server function
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


// Connecting to the Database
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));

// ...
