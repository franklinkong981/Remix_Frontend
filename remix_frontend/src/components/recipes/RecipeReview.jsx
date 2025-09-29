import React from "react";
import { Link } from "react-router-dom";

import "./RecipeReview.css";

/**
 * Shows a review of a recipe, includes the name of the recipe that was reviewed, the title, content, and date/time the recipe review was created. 
 * Name of the recipe will be a link to the recipe details page.
 * Rendered by the RecipeReviewList component.
 */
function RecipeReview({recipeId, recipeName, title, content, createdAt}) {

  return (
    <section className="RecipeReview card">
      <div className="RecipeReview-content card-body">
        <h3 className="RecipeReview-recipe-name">Review of {recipeName}</h3>
        <h1 className="RecipeReview-title card-title">
          {title}
        </h1>
        <p className="RecipeReview-content">{content}</p>
        <p className="RecipeReview-createdAt">Created on {createdAt}</p>
      </div>
    </section>
  );
}

export default RecipeReview;