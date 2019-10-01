const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  strMeal: {
    type: String
  },
  strMealThumb: {
    type: String
  },
  strCategory: {
    type: String
  },
  strArea: {
    type: String
  },
  strTags: {
    type: String
  },
  ingredients: {
    type: Array
  },
  strInstructions: {
    type: String
  },
  strYoutube: {
    type: String
  }
});

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
