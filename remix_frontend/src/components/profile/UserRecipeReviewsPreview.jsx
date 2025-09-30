import React, {useContext} from "react";

import {Link} from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import RecipeReviewList from "../recipes/RecipeReviewList.jsx";

//import {v4 as uuidv4} from "uuid";

/**
 * Component for the main page of a user's profile that displays the user's most recently added recipe review,
 * followed by a button to the user's full list of recipe reviews.
 * 
 * The recipe review will be passed in as a prop.
 * 
 * Contains RecipeReviewList component.
 */
function UserRecipeReviewsPreview({recipeReview}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

  //tests to see whether recipeReview is an object with properties or not.
  const isRecipeReviewValid = (recipeReview !== null) && (typeof recipeReview === 'object') && (Object.keys(recipeReview).length > 0);

  return (
    <div className="UserRecipeReviewsPreview">
      <h1 className="UserRecipeReviewsPreview-header">Your Newest Recipe Review</h1>
      {isRecipeReviewValid ? (
        <>
          <RecipeReviewList recipeReviews={[recipeReview]}/>
          <Link className="UserRecipeReviewsPreview-all-recipe-reviews btn btn-secondary font-weight-bold mr-3" to={`/users/${currentUserInfo.username}/reviews/recipes`}>
            See All Your Recipe Reviews
          </Link>
        </>
      ) : <p className="UserRecipeReviewsPreview-no-recipes">You currently do not have any recipe reviews.</p>}
      <hr />
    </div>
  );
}

export default UserRecipeReviewsPreview;