import React, {useState, useEffect} from "react";

import RecipeReview from "./RecipeReview.jsx";

import {v4 as uuidv4} from "uuid";

/**
 * Component that shows a list of recipe reviews, with each recipe review being a RecipeReview component.
 * Is used for pages that show a specific list of recipe reviews (ex. all recipe reviews belonging to a specific user).
 * 
 * The content each recipe review will have will be based on the page it's on.
 * If it's on a user profile page, it will display the id and name of the recipe it's a review of (recipeId, and recipeName)
 * If it's on the recipe details page, it will display the username of the user who created this review (reviewId and reviewAuthor)
 * 
 * No state in this component, the list of recipe reviews (an array of recipe review objects) to display is passed in.
 * 
 * Contains RecipeReview components.
 */
function RecipeReviewList({recipeReviews}) {
  return (
    <div className="RecipeReviewList col-md-8 offset-md-2">
      {recipeReviews.length ? (
        <div className="RecipeReviewList-list">
          {recipeReviews.map(recipeReview => (
            <RecipeReview key={uuidv4()} 
              reviewId={recipeReview.reviewId}
              reviewAuthor={recipeReview.reviewAuthor || ""}
              recipeId={recipeReview.recipeId} 
              recipeName={recipeReview.recipeName}
              title={recipeReview.title}
              content={recipeReview.content} 
              createdAt={recipeReview.createdAt}
            />
          ))}
        </div>
      ) : <p className="RecipeReviewList-no-recipe-reviews">No recipe reviews found.</p>}
    </div>
  );
}

export default RecipeReviewList;