const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  meal: {
    name: String,
    required: true,
    trim: true
  }
});

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
