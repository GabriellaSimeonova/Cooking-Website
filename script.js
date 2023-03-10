//api website: https://www.themealdb.com/api.php

//global variables
const searchBtn = document.getElementById('search-btn');
const randomBtn = document.querySelector('.random-btn');
const mealWrapper = document.querySelector('.meal-search');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const categoryBtns = document.querySelectorAll('#category-btn');
let html = '';

//load all recipes when website opens
window.addEventListener('load', ()=>{
    getMealList();
});

// event listeners
searchBtn.addEventListener('click', getMealList);
document.addEventListener("keyup", (e) => {
    if (e.code === 'Enter') {
        getMealList();
    }
});

randomBtn.addEventListener('click', getRandomRecipe);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealWrapper.classList.remove('blur');
    mealList.classList.remove('blur');
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});
categoryBtns.forEach(btn => {
    btn.addEventListener('click', filterByCategory)});


//filter for main ingredient
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                generateRecipeCard(meal);
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


//get the full information for the recipe
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}


//create modal to display the instructions
function mealRecipeModal(meal){
    html = '';
    console.log(meal);
    meal = meal[0];
    html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealWrapper.classList.add('blur');
    mealList.classList.add('blur');
    mealDetailsContent.parentElement.classList.add('showRecipe');
}


//get one random recipe to display
function getRandomRecipe(){
    html = '';
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(response => response.json())
    .then(data => {
        let meal = data.meals[0];
        generateRecipeCard(meal);
        mealList.innerHTML = html;
    });
}


//filter the recipes by the main categories
function filterByCategory(e){
    html ='';
    let category = '';
    switch (e.target.className) {
            case 'vegan':
                category = 'Vegan';
                break;
            case 'dessert':
                category = 'Dessert';
                break;
             case 'miscellaneous':
                category = 'Miscellaneous';
                break;
            case 'breakfast':
                category = 'Breakfast';
                break;  
            default:
                break;
        }

console.log(category);

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    .then(response => response.json())
    .then(data => {
                data.meals.forEach(meal => {
                    generateRecipeCard(meal);
                });
                mealList.innerHTML = html;
            });
        
}

//function to generate the inital card (used in every filter/function)
function generateRecipeCard(meal){
    html += `
    <div class = "meal-item" data-id = "${meal.idMeal}">
        <div class = "meal-img">
            <img src = "${meal.strMealThumb}" alt = "food">
        </div>
        <div class = "meal-name">
            <h3>${meal.strMeal}</h3>
            <a href = "#" class = "recipe-btn">Get Recipe</a>
        </div>
    </div>
`;
}