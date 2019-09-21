const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const router = require("./routes/meals");

const app = express();

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
// app.get("/find", async (req, res) => {
//   try {
//     const data = await getData(url);
//     console.log(data);
//     res.render("meals/meal");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.get("/about", (req, res) => {
//   res.render("about");
// });

// Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
