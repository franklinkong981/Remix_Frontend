import React from "react";

import {Link} from "react-router-dom";

import RecipeReviewList from "../recipes/RecipeReviewList.jsx";

//import {v4 as uuidv4} from "uuid";

/**
 * Component for the details page of a recipe that contains the most recently added review of the recipe.
 * Also contains a link to the page that displays the full list of reviews belonging to the recipe.
 * 
 * The recipe id (used for link to page for all recipe reviews) and recipe review object containing information about the review will be passed in as props.
 * 
 * Contains RecipeReviewList component.
 */
function RecipeReviewsPreview({recipeId, recipeName, recipeReview}) {

  // tests to see whether recipeReview is an object with properties or not. If the recipe doesn't have any recipe reviews, 
  // the recipeReview object prop will be empty.
  const isRecipeReviewValid = (recipeReview !== null) && (typeof recipeReview === 'object') && (Object.keys(recipeReview).length > 0);

  return (
    <div className="RecipeReviewsPreview">
      <h1 className="RecipeReviewsPreview-header">Newest Review for {recipeName}</h1>
      {isRecipeReviewValid ? (
        <>
          <RecipeReviewList recipeReviews={[recipeReview]}/>
          <Link className="RecipeReviewsPreview-all-recipe-reviews btn btn-secondary font-weight-bold mr-3" 
                to={`/recipes/${recipeId}/reviews`}
                state={{recipeId, recipeName}}
          >
            See All Reviews for this Recipe
          </Link>
        </>
      ) : <p className="RecipeReviewsPreview-no-recipes">This recipe currently does not have any recipe reviews. Be the first to add one!</p>}
      <Link className="RecipeReviewsPreview-add-review btn btn-secondary font-weight-bold mr-3" 
        to={`/recipes/${recipeId}/reviews/new`}
        state={{recipeName}}
      >
        Add New Review
      </Link>
      <hr />
    </div>
  );
}

export default RecipeReviewsPreview;