let RecipeArray = [];

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

// Preload some recipes -- Now done on Server, not here
// RecipeArray.push(new RecipeObject("Chicken & Spinach Skillet Pasta", "American", "Medium", "https://www.eatingwell.com/recipe/267768/chicken-spinach-skillet-pasta-with-lemon-parmesan/"));
// RecipeArray.push(new RecipeObject("Spaghetti & Spinach with Sun-Dried Tomato", "Italian", "Easy", "https://www.eatingwell.com/recipe/7919563/spaghetti-spinach-with-sun-dried-tomato-cream-sauce/"));
// RecipeArray.push(new RecipeObject("One-Pot Garlicky Shrimp & Broccoli ", "Chinese", "Medium", "https://www.eatingwell.com/recipe/7919492/one-pot-garlicky-shrimp-broccoli/"));

let selectedCuisine = "Italian";
let selectedDifficulty = "Medium";

function createList() {
    let myul = document.getElementById("myul");
    myul.innerHTML = ""; // Clear existing list items

    $.get("/getAllRecipes", function (data, status) { // AJAX get
        RecipeArray = data; // copy returned server json data into local array
        // now INSIDE this “call back” anonymous function,
        // update the web page with this new data

        RecipeArray.forEach(function (element) {
            let li = document.createElement('li');
            // Include the ID in the displayed text
            li.innerHTML = `<a href="#details" onclick="showDetails('${element.ID}')">${element.ID}: ${element.name} - ${element.cuisine}</a>`;
            myul.appendChild(li);
        });

        if ($("#myul").hasClass('ui-listview')) {
            $("#myul").listview('refresh');
        }
    });
}

function showDetails(localID) {
    let pointer = GetObjectPointer(localID);
    if (pointer !== -1) {
        let data = RecipeArray[pointer];
        document.getElementById("theID").innerHTML = "ID: " + data.ID;
        document.getElementById("theName").innerHTML = "Name: " + data.name;
        document.getElementById("theCuisine").innerHTML = "Cuisine: " + data.cuisine;
        document.getElementById("theDifficulty").innerHTML = "Difficulty: " + data.difficulty;
        document.getElementById("theURL").innerHTML = "Click for instructions: <a href='" + data.URL + "' target='_blank'>Recipe Instructions</a>";
        $.mobile.changePage("#details");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes) {
        RecipeArray = JSON.parse(storedRecipes);
    }

    createList();

    document.getElementById("buttonAdd").addEventListener("click", function () {
        let nameInput = document.getElementById("dataInput").value;
        let URLinput = document.getElementById("URLinput").value;
        let recipe = new RecipeObject(nameInput, selectedCuisine, selectedDifficulty, URLinput);
        RecipeArray.push(recipe);

        document.getElementById("dataInput").value = "";
        document.getElementById("URLinput").value = "";

        localStorage.setItem("recipes", JSON.stringify(RecipeArray));
        createList();
        $.mobile.changePage("#show");
    });

    // button details page to delete
    document.getElementById("delete").addEventListener("click", function () {
        let recipeID = localStorage.getItem('parm');
        $.ajax({
            type: "DELETE",
            url: "/DeleteRecipe/" +recipeID,
            success: function(result){},
            
            error: function (xor, textSt, errorThrown) {
                alert("Server could not delete Recipe with ID " + recipeID);
            }
        });
    });



    document.getElementById("select-cuisine").addEventListener("change", function () {
        selectedCuisine = this.value;
    });

    document.getElementById("select-difficulty").addEventListener("change", function () {
        selectedDifficulty = this.value;
    });
});
