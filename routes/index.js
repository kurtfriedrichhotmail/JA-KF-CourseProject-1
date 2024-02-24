var express = require('express');
var router = express.Router();

let ServerRecipeArray = [];

let RecipeObject = function (pName, pCuisine, pDifficulty, pURL) {
    this.ID = Math.random().toString(16).slice(2, 10); // Generates a random ID
    this.name = pName;
    this.cuisine = pCuisine;
    this.difficulty = pDifficulty;
    this.URL = pURL;
};

function GetObjectPointer(localID) {
    return RecipeArray.findIndex(recipe => recipe.ID === localID);
}

// Preload some recipes
ServerRecipeArray.push(new RecipeObject("Chicken & Spinach Skillet Pasta", "American", "Medium", "https://www.eatingwell.com/recipe/267768/chicken-spinach-skillet-pasta-with-lemon-parmesan/"));
ServerRecipeArray.push(new RecipeObject("Spaghetti & Spinach with Sun-Dried Tomato", "Italian", "Easy", "https://www.eatingwell.com/recipe/7919563/spaghetti-spinach-with-sun-dried-tomato-cream-sauce/"));
ServerRecipeArray.push(new RecipeObject("One-Pot Garlicky Shrimp & Broccoli ", "Chinese", "Medium", "https://www.eatingwell.com/recipe/7919492/one-pot-garlicky-shrimp-broccoli/"));

console.log(ServerRecipeArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});


/* GET all Recipe data */
router.get('/getAllRecipes', function(req, res) {
  res.status(200).json(ServerRecipeArray);
});

module.exports = router;
