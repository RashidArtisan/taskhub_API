import express from "express";
import config from "config";
import dbConnection from "../config/database";
import helmet from "helmet";
import passport from "passport";
import initializePassport from "./middleware/authentication";
import updateExpiredOtps from "../config/otp";

//routes modules
import baseUrl from "./routes/base";
import signUp from "./routes/signup";
import signIn from "./routes/signin";

dbConnection; //calling the dbConnection in app.ts
initializePassport(passport); // Pass initialized Passport instance to the middleware
updateExpiredOtps();

setInterval(() => {
  updateExpiredOtps();
}, 1000);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(passport.initialize()); // passport initialization

/* Templating Engine using ejs */
app.set("view engine", "ejs");
app.set("views", "./src/views");

//routes
app.use("/", baseUrl);
app.use("/signup", signUp);
app.use("/signin", signIn);

const port: number = config.get("DB.DB_PORT") || 5000;

app.listen(port, () => console.log(`TaskHub is listening on port ${port}...`));
