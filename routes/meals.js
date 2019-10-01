const express = require("express");
const router = express.Router();
const getAPImeal = require("../models/fetchMeal");
const Meal = require("../models/meal");

// Routes

// Show Random meal get form
router.get("/meal", async (req, res) => {
  res.render("meals/meal");
});

let lastMeal = {};

// Show Random Meal results
router.get("/random", async (req, res) => {
  try {
    const meal = await getAPImeal("random", null);
    lastMeal = meal;
    res.render("meals/random", {
      meal: meal
    });
  } catch (err) {
    console.warn(err);
  }
});

// Save Random meal to db
router.get("/save", async (req, res) => {
  const meal = new Meal(lastMeal);

  try {
    await meal.save();
    res.status(201).render("meals/saved", {
      meal: meal
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all saved meal
router.get("/mymeals", async (req, res) => {
  const meals = await Meal.find();
  res.json(meals);
});

// Search for meal by name
// router.post("/search", async (req, res) => {
//   try {
//     const url = getUrl("search", req.body.search);
//     const data = await getData(url);
//     if (!data) return res.status(404).send("no meal found");
//     const { ingredients, meal } = await createMeal(data);

//     res.render("meals/find", {
//       meal,
//       ingredients
//     });
//   } catch (err) {
//     console.warn(err);
//   }
// });

module.exports = router;
