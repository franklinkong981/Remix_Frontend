import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import RemixApi from "../../api/api.js";
import RemixList from "../remixes/RemixList.jsx";
import RecipeReviewsPreview from "./RecipeReviewsPreview.jsx";

/**
 * Recipe Details page top-level component.
 * This is the page that shows full detailed information about a recipe including ingredients, directions, number of servings, cooking time,
 * the user who created it, etc. which will then be followed by the list of Remixes of the recipe presented as a RemixList component
 * of RemixCard components, followed by the most recently added review of the recipe as a RecipeReviewsPreview component, which contains
 * a link to the page that lists out all recipe reviews of the recipe.
 * 
 * Route is /recipes/:recipeId
 * 
 * Contains the RemixList and the RecipeReviewsPreview components.
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
      <h1 className="RecipeDetail-name">{recipeDetailedInfo.name}</h1>
      <RecipeReviewsPreview recipeId={recipeDetailedInfo.id} recipeName={recipeDetailedInfo.name} recipeReview={recipeDetailedInfo.mostRecentRecipeReview} />
    </div>
  );
}

export default CompanyDetail;