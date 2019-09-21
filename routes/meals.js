const express = require("express");
const axios = require("axios");

const router = express.Router();

// Fetch data from API

const createMeal = meal => {
  const ingredients = [];
  // Get all ingredients from the object. Up to 20
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
      //console.log("indegs", ingredients);
    } else {
      // Stop if no more ingredients
      break;
    }
  }
  return ingredients;
};

const url = "https://www.themealdb.com/api/json/v1/1/random.php";

const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;

    return createMeal(data.meals[0]);
    // console.log("Meal is::", data.meals[0].strMeal);
  } catch (error) {
    console.log(error);
  }
};

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

router.get("/find", async (req, res) => {
  try {
    const data = await getData(url);
    console.log("find route data::", data);
    res.render("meals/find");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
