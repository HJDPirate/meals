const express = require("express");
const router = express.Router();
const getAPImeal = require("../models/fetchMeal");
const Meal = require("../models/meal");
const auth = require("../middleware/auth");

// Routes

// Show Random meal get form
router.get("/meal", async (req, res) => {
  res.render("meals/meal");
});

let lastMeal = {};

// Find Remote Random Meal
router.get("/random", async (req, res) => {
  try {
    const meal = await getAPImeal("random", null);
    lastMeal = meal;
    res.send(meal);
    // res.render("meals/random", {
    //   meal: meal
    // });
  } catch (err) {
    console.warn(err);
  }
});

// Save Remote Random meal to db
router.get("/save", auth, async (req, res) => {
  try {
    const meal = new Meal({
      ...lastMeal,
      notes: req.body.notes,
      favorite: req.body.favorite,
      author: req.user._id
    });

    if (!meal.strMeal) {
      return res.status(400).send("no meal found");
    }

    const existMeal = await Meal.findOne({
      author: req.user._id,
      strMeal: meal.strMeal
    });

    if (existMeal) {
      return res.status(400).send("meal already saved");
    }

    await meal.save();
    res.status(201).render("meals/saved", {
      meal: meal
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all of user's saved meals or query meals
// GET /mymeals?favorite=true
// GET /mymeals?limit=10&skip=0
// GET /mymeals?sortBy=createdAt:desc
router.get("/mymeals", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.favorite) {
    match.favorite = req.query.favorite === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "meals",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(req.user.meals);
  } catch (e) {
    res.status(500).send();
  }
});

// Get meal by id
router.get("/:id", auth, async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      author: req.user._id
    });
    console.log("meal is", meal);
    if (!meal) {
      return res.status(404).send();
    }
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Edit meal by id
router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["notes", "favorite"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      author: req.user._id
    });

    if (!meal) {
      return res.status(404).send("meal not found");
    }

    updates.forEach(update => (meal[update] = req.body[update]));
    await meal.save();
    res.send(meal);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete meal by id
router.delete("/:id", auth, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!meal) {
      res.status(404).send();
    }

    res.send(meal);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
