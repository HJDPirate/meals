const express = require("express");
const axios = require("axios");

const router = express.Router();

// Fetch data from API

const getUrl = (endPt, value) => {
  if (endPt === "random") {
    return `https://www.themealdb.com/api/json/v1/1/random.php`;
  }
  if (endPt === "search") {
    return `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`;
  } else {
    return new Error("Invalid search type!");
  }
};

const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.warn(error);
  }
};

async function createMeal(meal) {
  const ingredients = [];
  // Get all ingredients from the object. Up to 20
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      // Stop if no more ingredients
      break;
    }
  }
  if (meal.strTags) {
    meal.strTags = meal.strTags.split(",").join(", ");
  }

  if (meal.strYoutube) {
    meal.strYoutube = `https://www.youtube.com/embed/${meal.strYoutube.slice(
      -11
    )}`;
  }

  return { ingredients: ingredients, meal: meal };
}

// Routes
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/meal", (req, res) => {
  res.render("meals/meal");
});

// Get Random Meal
router.get("/find", async (req, res) => {
  try {
    const url = getUrl("random", null);
    const data = await getData(url);
    const { ingredients, meal } = await createMeal(data);

    res.render("meals/find", {
      meal,
      ingredients
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
