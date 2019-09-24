const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const router = require("./routes/meals");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

app.use(morgan("dev"));

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

// Static folder
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// Routes
app.use("/", router);
app.use("*", (req, res) => {
  res.status(404).send("<h1 >STATUS 404<br>FILE NOT FOUND</h1>");
});

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
