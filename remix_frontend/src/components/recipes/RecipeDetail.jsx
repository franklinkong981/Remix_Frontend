import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import RemixApi from "../../api/api.js";

import RecipeRemixesPreview from "./RecipeRemixesPreview.jsx";
import RecipeReviewsPreview from "./RecipeReviewsPreview.jsx";

/**
 * Recipe Details page top-level component.
 * This is the page that shows full detailed information about a recipe including ingredients, directions, number of servings, cooking time,
 * the user who created it, etc. which will then be followed by a list of up to 3 of the most recently added Remixes of the recipe presented as a RemixList component
 * of RemixCard components (and a link to the page that displays all of the remixes of the recipe),
 * followed by the most recently added review of the recipe as a RecipeReviewsPreview component, which contains
 * a link to the page that lists out all recipe reviews of the recipe.
 * 
 * Route is /recipes/:recipeId
 * 
 * Contains the RecipeRemixesPreview and the RecipeReviewsPreview components.
 * 
 */
function RecipeDetail() {
  const {recipeId} = useParams();
  const [recipeDetailedInfo, setRecipeDetailedInfo] = useState(null);

  //retrieve detailed info about recipe, including its 3 most recently added remixes and most recently added review from the Remix API.
  // While this is happening, the word "Loading" is displayed on the screen. Recipe, remix, and recipe review information won't be displayed 
  // until the detailed information of the recipe is returned from the API.
  useEffect(function loadRecipeDetailsWhenMounted() {
    async function fetchRecipeDetails() {
      const recipe = await RemixApi.getRecipeDetails(recipeId);
      setRecipeDetailedInfo(recipe);
    }
    fetchRecipeDetails();
  }, [recipeId]);

  if (!recipeDetailedInfo) return <h1>Loading...</h1>

  return (
    <div className="RecipeDetail col-md-8 offset-md-2">
      <img className="RecipeDetail-image img-fluid" src={recipeDetailedInfo.imageUrl} alt={`Picture of ${recipeDetailedInfo.name}`}></img>
      <h1 className="RecipeDetail-name">{recipeDetailedInfo.name}</h1>
      <h2 className="RecipeDetail-description">{recipeDetailedInfo.description}</h2>
      <p className="RecipeDetail-author">Created by {recipeDetailedInfo.recipeAuthor} on {recipeDetailedInfo.createdAt}.</p>
      <hr />
      <h3 className="RecipeDetails-details-header">Recipe Details:</h3>
      <p className="RecipeDetails-ingredients">Ingredients: {recipeDetailedInfo.ingredients}</p>
      <p className="RecipeDetails-directions">Instructions: {recipeDetailedInfo.directions}</p>
      <p className="RecipeDetails-cooking-time">Cooking Time: {recipeDetailedInfo.cookingTime > 0 ? recipeDetailedInfo.cookingTime : "N/A"}</p>
      <p className="RecipeDetails-servings">Servings: {recipeDetailedInfo.servings > 0 ? recipeDetailedInfo.servings : "N/A"}</p>
      <hr />
      <RecipeRemixesPreview recipeId={recipeDetailedInfo.id} recipeName={recipeDetailedInfo.name} remixes={recipeDetailedInfo.remixes} />
      <RecipeReviewsPreview recipeId={recipeDetailedInfo.id} recipeName={recipeDetailedInfo.name} recipeReview={recipeDetailedInfo.mostRecentRecipeReview}/>
    </div>
  );
}

/*{ recipeDetails: {id, recipeAuthor, name, description, ingredients, directions, cookingTime, servings, 
 * (3 most recent)remixes: [ {id, name, description, imageUrl, createdAt}, ... ], mostRecentRecipeReview: {id, reviewAuthor, title, content, createdAt}, imageUrl, createdAt} } */
export default RecipeDetail;