import express from "express";
import dotenv from "dotenv";
import RoutesSetup from "./lib/RoutesSetup.js";
import MongooseSetup from "./lib/MongooseSetup.js";
import PassportSetup from "./lib/PassportSetup.js";
import session from "express-session";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";

// This loads our .env and adds the variables to the environment
dotenv.config();

// This creates our application
const app = express();
// Increase the payload size limit for JSON requests
app.use(bodyParser.json({ limit: "10mb" }));


// Increase the payload size limit for URL-encoded requests
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Setup CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

// Setup sessions
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  })
);

// Clear session temp values
app.use((req, res, next) => {
  res.locals.notifications = req.session?.notifications;
  delete req.session.notifications;
  next();
});

// Setup Mongoose
MongooseSetup();

// Setup Passport
PassportSetup(app);

// Set our view engine (HTML renderer)
app.set("view engine", "ejs");

// Set the public assets folder
app.use(express.static("public"));
app.use(express.static("avatars"));

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing url-encoded requests
app.use(express.urlencoded({ extended: true }));

// Method overriding to deal with unsupported HTTP methods in certain platforms
app.use((req, _, next) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    const method = req.body._method;
    delete req.body._method;
    req.method = method;
  }
  next();
});

// Set up routes
RoutesSetup(app);

// Error handler
app.use((error, req, res, __) => {
  // Convert string errors to proper errors
  if (typeof error === "string") {
    error = new Error(error);
  }
  // Add a generic status
  if (!error.status) error.status = 404;

  // Output error and stack trace to console
  console.error(error);

  // Handle the various formats for our API
  res.format({
    "text/html": () => {
      // Output the error to the user
      if (req.session) {
        req.session.notifications = [
          {
            alertType: "alert-danger",
            message: error.message,
          },
        ];
      }
      res.status(error.status).redirect("/");
    },
    "application/json": () => {
      res
        .status(error.status)
        .json({ status: error.status, message: error.message });
    },
    default: () => {
      res.status(406).send("NOT ACCEPTABLE");
    },
  });
});

// Export the application
export default app;
  