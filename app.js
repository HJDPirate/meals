const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mealsRouter = require("./routes/meals");
const usersRouter = require("./routes/users");
const mongoose = require("mongoose");

// Connect database
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

const app = express();

app.use(morgan("dev"));

// Static folder
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static("public"));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars Middleware
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: "hbs"
  })
);

app.set("view engine", "hbs");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/meals", mealsRouter);
app.use("/users", usersRouter);
app.all("*", (req, res, next) => {
  res.send("Page not found!");
  //next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
