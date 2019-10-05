const axios = require("axios");

const getAPImeal = async function(endPt, value) {
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

  const createMeal = meal => {
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

    return { ...meal, ingredients };
  };

  const url = getUrl(endPt, value);
  const data = await getData(url);
  const meal = await createMeal(data);
  // console.log(meal);
  return meal;
};
//getAPImeal("random", null);
module.exports = getAPImeal;
