require("dotenv").config();
const asyncMySQL = require("./mysql/connection");
const checkDBStatus = require("./tests/sql");
const express = require("express");
const cors = require("cors");
const app = express();
const { addToLog } = require("./middleware/logging");
const { checkToken } = require("./middleware/auth");

// Allow requests from specific origins
const allowedOrigins = [
  "http://localhost:3000", // For local development
  "https://makefoodnotwaste.co.uk", // Production domain
  "http://makefoodnotwaste.co.uk",
  "https://api.makefoodnotwaste.co.uk", // API subdomain
  "http://api.makefoodnotwaste.co.uk"
];

// cors middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies and credentials to be sent cross-origin
  })
);

// check the db status
checkDBStatus(asyncMySQL);

// (global) middleware
app.use(express.static("public")); // handle static files such as images
app.use(express.json());

// utility middleware, attaching SQL connection to req
app.use((req, res, next) => {
  req.asyncMySQL = asyncMySQL;
  next();
});

// logging middleware
app.use(addToLog);

//ROUTES
// no auth needed
app.use("/signup", require("./routes/signup"));
app.use("/login", require("./routes/login"));

// auth needed
app.use("/logoff", checkToken, require("./routes/logoff"));
app.use("/users", checkToken, require("./routes/users"));
app.use("/pantry", checkToken, require("./routes/pantry"));
app.use("/saved-recipes", checkToken, require("./routes/saved-recipes"));

const port = process.env.port || 6005;

app.listen(port, () => {
  console.log(`The server is running on port ${port}.`);
});
