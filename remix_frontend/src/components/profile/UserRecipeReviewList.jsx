import React, {useState, useEffect} from "react";

import {useParams} from "react-router-dom";

import RecipeReviewList from "../recipes/RecipeReviewList.jsx";
import RemixApi from "../../api/api.js";

//import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the list of recipes reviews belonging to a specific user.
 * When page loads, loads the list of recipe reviews belonging to the user and displays them.
 * 
 * Route: /users/:username/reviews/recipes
 * 
 * Contains RecipeReviewList component.
 */
function UserRecipeReviewList() {
  const params = useParams();
  const [listOfRecipeReviews, setListOfRecipeReviews] = useState(null);

  // Retrieve user's recipe reviews data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the recipe review list is retrieved, displays them each as a RecipeReview component in a RecipeReviewList component
  useEffect(function loadRecipeReviewsWhenMounted() {
    async function fetchRecipeReviews() {
      const userRecipeReviews = await RemixApi.getUsersRecipeReviews(params.username);
      setListOfRecipeReviews(userRecipeReviews);
    }
    fetchRecipeReviews();
  }, []);

  //if listOfRecipeReviews is empty, will still be truthy, so won't show loading screen.
  if (!listOfRecipeReviews) {
    return <h1 className="UserRecipeReviewList-loading">Loading...</h1>
  }
  
  return (
    <div className="UserRecipeReviewList">
      <h1 className="UserRecipeReviewList-header">Your Recipe Reviews</h1>
      {listOfRecipeReviews.length ? (
        <RecipeReviewList recipeReviews={listOfRecipeReviews}/>
      ) : <p className="UserRecipeReviewList-no-reviews">You currently don't have any recipe reviews.</p>}
    </div>
  );
}

export default UserRecipeReviewList;