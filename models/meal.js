const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    strMeal: {
      type: String,
      rwquired: true
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
      type: Array,
      rwquired: true
    },
    strInstructions: {
      type: String,
      rwquired: true
    },
    strYoutube: {
      type: String
    },
    notes: {
      type: String
    },
    favorite: {
      type: Boolean,
      default: false
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
