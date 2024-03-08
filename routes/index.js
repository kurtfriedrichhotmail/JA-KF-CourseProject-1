var express = require('express');
var router = express.Router();
var fs = require("fs");
var cors = require('cors');

var app = express();


// start by creating data so we don't have to type it in each time
let ServerRecipeArray = [];

// define a constructor to create recipe objects
let RecipeObject = function (pName, pCuisine, pDifficulty, pURL) {
    this.ID = Math.random().toString(16).slice(2, 10); // Generates a random ID
    this.name = pName;
    this.cuisine = pCuisine;
    this.difficulty = pDifficulty;
    this.URL = pURL;
};

// add route for delete
router.delete('/DeleteRecipe/:ID', (req, res) => {
  const delID = req.params.ID;
  let pointer = GetObjectPointer(delID);

   if(pointer == -1) {  // if did nt find movie in array
    console.log("not found");
    return res.status(500).json({
        status: "error - no such ID"
    });

  } else {  // if did find the recipe
    ServerRecipeArray.splice(pointer, 1);  // remove 1 element at index
    fileManager.write();
    res.send('Recipe with ID: ' + delID + ' deleted!');
  }
});

function GetObjectPointer(localID) {
    return ServerRecipeArray.findIndex(recipe => recipe.ID === localID);
}

// var fs = require("fs"); // relocate to line 3

let fileManager = {
  read: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    let goodData = JSON.parse(rawdata);
    ServerRecipeArray = goodData;
  },

  write: function() {
    let data = JSON.stringify(ServerRecipeArray);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if(rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};

if(!fileManager.validData()) {
ServerRecipeArray.push(new RecipeObject("Chicken & Spinach Skillet Pasta", "American", "Medium", "https://www.eatingwell.com/recipe/267768/chicken-spinach-skillet-pasta-with-lemon-parmesan/"));
ServerRecipeArray.push(new RecipeObject("Spaghetti & Spinach with Sun-Dried Tomato", "Italian", "Easy", "https://www.eatingwell.com/recipe/7919563/spaghetti-spinach-with-sun-dried-tomato-cream-sauce/"));
ServerRecipeArray.push(new RecipeObject("One-Pot Garlicky Shrimp & Broccoli ", "Chinese", "Medium", "https://www.eatingwell.com/recipe/7919492/one-pot-garlicky-shrimp-broccoli/"));
fileManager.write();
}

else {
  fileManager.read(); // do have prior recipes so load up the array
  }

console.log(ServerRecipeArray);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
})

/* GET all Recipe data */
router.get('/getAllRecipes', function(req, res) {
  fileManager.read()
  res.status(200).json(ServerRecipeArray);
})

/* Add one new recipe */
router.post('/AddRecipe', function(req, res) {
  const newRecipe = req.body;
  ServerRecipeArray.push(newRecipe);
  fileManager.write();
  res.status(200).json(newRecipe);
});

module.exports = router;
