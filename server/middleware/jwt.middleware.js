const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const arr = req.headers.authorization.split(" ");
  if (arr[0] === "Bearer" && arr[1]) {
    const theToken = arr[1];
    try {
      const decodedToken = jwt.verify(theToken, process.env.TOKEN_SECRET);

      req.payload = decodedToken;
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  } else {
    res.status(400).json({ message: "No token" });
  }
}

//export the function so other files can use it
module.exports = { isAuthenticated };