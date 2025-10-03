import React, {useState, useEffect} from "react";

import {useParams, useLocation} from "react-router-dom";

import RecipeReviewList from "./RecipeReviewList.jsx";
import RemixApi from "../../api/api.js";

//import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the full list of recipe reviews belonging to a specific recipe.
 * When page loads, loads the list of recipe reviews belonging to the recipe and displays them.
 * 
 * Route: /recipes/:recipeId/reviews
 * 
 * Contains RecipeReviewList component.
 */
function FullRecipeReviewList() {
  const params = useParams();
  const location = useLocation();
  //locationRecipe = state passed in from the /recipes/:recipeId aka recipe details page route, contains {recipeId, recipeName}
  const locationRecipe = location.state;
  const [listOfRecipeReviews, setListOfRecipeReviews] = useState(null);

  // Retrieve recipe's reviews data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the recipe review list is retrieved, displays them each as a RecipeReview component in a RecipeReviewList component.
  useEffect(function loadRecipeReviewsWhenMounted() {
    async function fetchRecipeReviews() {
      const allRecipeReviews = await RemixApi.getAllRecipeReviews(params.recipeId);
      setListOfRecipeReviews(allRecipeReviews);
    }
    fetchRecipeReviews();
  }, []);

  //if listOfRecipeReviews is empty, will still be truthy, so won't show loading screen.
  if (!listOfRecipeReviews) {
    return <h1 className="UserRecipeReviewList-loading">Loading...</h1>
  }
  
  return (
    <div className="FullRecipeReviewList">
      <h1 className="FullRecipeReviewList-header">
        All Recipe Reviews for 
        <Link className="FullRecipeReviewList-details-page-link" to={`/recipes/${locationRecipe.recipeId}`}>
          {locationRecipe.recipeName}
        </Link>
      </h1>
      {listOfRecipeReviews.length ? (
        <RecipeReviewList recipeReviews={listOfRecipeReviews}/>
      ) : <p className="FullRecipeReviewList-no-reviews">This recipe currently doesn't have any recipe reviews.</p>}
    </div>
  );
}

export default FullRecipeReviewList;