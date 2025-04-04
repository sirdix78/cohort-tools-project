require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
// const cohorts = require("./api/cohorts.json");
// const students = require("./api/students.json");
const cors = require("cors");
const mongoose = require("mongoose"); // Connecting to the Database
const Cohort = require("./models/cohorts.model");
const Student = require("./models/students.model");
const authRoutes = require('./routes/auth.routes');

const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// Connecting to the Database
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((error) => console.error("Error connecting to MongoDB", error));

// ...

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Mount the auth routes
app.use('/', authRoutes);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
  return;
});

//Student Routes
//GET /api/students - Retrieves all of the students in the database collection
app.get("/api/students", (req, res, next) => {
  Student.find(req.body)
    .populate("cohort")
    .then((allStudents) => {
      res.status(200).json(allStudents);
      return;
    })
    .catch((error) => {
      // res
      //   .status(500)
      //   .json({ errorMessage: "Error retrieving students", error });
      next(error);
      return;
    });
});

//POST /api/students - Creates a new student

app.post("/api/students", async (req, res, next) => {
  Student.create(req.body)
    .then((createdStudent) => {
      console.log("good job", createdStudent);
      res.status(201).json(createdStudent);
    })
    .catch((error) => {
      // console.log(err);
      // res.status(500).json({ errorMessage: "Problem creating student" });
      next(error);
    });
});

//GET /api/students/cohort/:cohortId - Retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((studentsInCohort) => {
      console.log("students in this cohort", studentsInCohort);
      res.status(200).json(studentsInCohort);
    })
    .catch((err) => {
      console.log(error);
      // res
      //   .status(500)
      //   .json({ errorMessage: "Problem finding students in this cohort" });
      next(error);
    });
});

//GET - Retrieves a specific student by id
app.get("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;
  Student.findById(studentId)
    .populate("cohort")
    .then((oneStudent) => {
      console.log("here is one student", oneStudent);
      res.status(200).json(oneStudent);
    })
    .catch((error) => {
      // console.log(err);
      // res.status(500).json({ errorMessage: "trouble finding the one student" });
      next(error);
    });
});

//PUT /api/students/:studentId - Updates a specific student by id
app.put("/api/students/:studentId", async (req, res, next) => {
  try {
    const updatedStudent = await Student.findOneAndReplace(
      { _id: req.params.studentId },
      req.body
    );
    console.log("here is the updated student:", updatedStudent);
    res.status(200).json(updatedStudent);
  } catch (error) {
    // console.log(err);
    // res.status(500).json({ errorMessage: "trouble updating the student" });
    next(error);
  }
});

//DELETE /api/students/:studentId - Deletes a specific student by id
app.delete("/api/students/:studentId", async (req, res, next) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.studentId
    );
    console.log("here is the deleted student:", deletedStudent);
    res.status(200).json(deletedStudent);
  } catch (error) {
    // console.log(err);
    // res.status(500).json({ errorMessage: "trouble deleting the student" });
    next(error);
  }
});

// Cohort Routes
//POST /api/cohorts - Creates a new cohort

app.post("/api/cohorts", async (req, res, next) => {
  Cohort.create(req.body)
    .then((createdCohort) => {
      console.log("good job", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      // console.log(err);
      // res.status(500).json({ errorMessage: "Problem creating cohort" });
      next(error);
    });
});

// GET /api/cohorts - Retrieves all of the cohorts in the database collection
app.get("/api/cohorts", (req, res, next) => {
  Cohort.find()
    .then((allCohorts) => {
      res.status(200).json(allCohorts);
      return;
    })
    .catch((error) => {
      // res.status(500).json({ errorMessage: "Error retrieving cohorts", error });
      next(error);
      return;
    });
});

//GET /api/cohorts/:cohortId - Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((oneCohort) => {
      console.log("here is one cohort", oneCohort);
      res.status(200).json(oneCohort);
    })
    .catch((error) => {
      // console.log(err);
      // res.status(500).json({ errorMessage: "trouble finding the one cohort" });
      next(error);
    });
});
//PUT /api/cohorts/:cohortId - Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const updatedCohort = await Cohort.findOneAndReplace(
      { _id: req.params.cohortId },
      req.body
    );
    console.log("here is the updated cohort:", updatedCohort);
    res.status(200).json(updatedCohort);
  } catch (error) {
    // console.log(err);
    // res.status(500).json({ errorMessage: "trouble updating the cohort" });
    next(error);
  }
});
//DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const deletedCohort = await Cohort.findByIdAndDelete(req.params.cohortId);
    console.log("here is the deleted cohort:", deletedCohort);
    res.status(200).json(deletedCohort);
  } catch (error) {
    // console.log(err);
    // res.status(500).json({ errorMessage: "trouble deleting the cohort" });
    next(error);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER // never have a return inside the server function
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
