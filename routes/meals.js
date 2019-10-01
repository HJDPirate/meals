const express = require("express");
const router = express.Router();
const getAPImeal = require("../models/fetchMeal");
// Routes

router.get("/meal", (req, res) => {
  res.render("meals/meal");
});

// Get Random Meal
router.get("/random", async (req, res) => {
  try {
    const meal = await getAPImeal("random", null);
    res.render("meals/random", {
      meal: meal
    });
  } catch (err) {
    console.warn(err);
  }
});

router.post("/search", async (req, res) => {
  try {
    const url = getUrl("search", req.body.search);
    const data = await getData(url);
    if (!data) return res.status(404).send("no meal found");
    const { ingredients, meal } = await createMeal(data);

    res.render("meals/find", {
      meal,
      ingredients
    });
  } catch (err) {
    console.warn(err);
  }
});

module.exports = router;
