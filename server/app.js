import express from "express";
import dotenv from "dotenv";
import RoutesSetup from "./lib/RoutesSetup.js";
import MongooseSetup from "./lib/MongooseSetup.js";
import PassportSetup from "./lib/PassportSetup.js";
import session from "express-session";
import cors from "cors";
import multer from "multer"; // Import multer

// This loads our .env and adds the variables to the environment
dotenv.config();

// This creates our application
const app = express();


app.use('/generated_pdfs', express.static('generated_pdfs'));

// This sets up CORS
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

// This sets our view engine (HTML renderer)
app.set("view engine", "ejs");

// This sets the public assets folder
app.use(express.static("public"));
app.use(express.static("avatars"));

// Middleware for parsing url-encoded requests
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing JSON requests
app.use(express.json());

// Set up multer middleware to handle multipart/form-data
const upload = multer();

// Middleware to handle form data with multipart/form-data
app.use(upload.none());

// Method overriding to deal with unsupported HTTP methods in certain platforms
app.use((req, _, next) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    const method = req.body._method;

    delete req.body._method;

    req.method = method;
  }

  next();
});

RoutesSetup(app);

// Our error handler
app.use((error, req, res, __) => {
  // Converts string errors to proper errors
  if (typeof error === "string") {
    error = new Error(error);
  }

  // Adds a generic status
  if (!error.status) error.status = 404;

  // Outputs our error and stack trace to our console
  console.error(error);

  // Handle the various formats for our API
  res.format({
    "text/html": () => {
      // Outputs the error to the user
      if (req.session)
        req.session.notifications = [
          {
            alertType: "alert-danger",
            message: error.message,
          },
        ];

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

/**
 * We are exporting our application so we are able to use it in
 * our tests
 */
export default app;
