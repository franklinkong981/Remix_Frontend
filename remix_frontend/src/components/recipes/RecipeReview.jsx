import React, {useContext} from "react";
import { Link } from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import "./RecipeReview.css";

/**
 * Shows a review of a recipe, includes the name of the recipe that was reviewed, the title, content, and date/time the recipe review was created. 
 * Name of the recipe will be a link to the recipe details page.
 * Rendered by the RecipeReviewList component.
 */
function RecipeReview({reviewId, reviewAuthor="", recipeId, recipeName, title, content, createdAt}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

  return (
    <section className="RecipeReview card">
      <div className="RecipeReview-content card-body">
        {recipeName ? (
          <p className="RecipeReview-recipe-name">Review of <Link className="RecipeReview-link font-weight-bold" to={`/recipes/${recipeId}`}>
              {recipeName}
            </Link>
          </p>
        ) : null}
        {reviewAuthor ? <p className="RecipeReview-recipe-author">Created by {reviewAuthor}</p> : null}
        <h1 className="RecipeReview-title card-title">
          {title}
        </h1>
        <p className="RecipeReview-content">{content}</p>
        <p className="RecipeReview-createdAt">Created on {createdAt}</p>
        { ((!reviewAuthor) || reviewAuthor == currentUserInfo.username) && <Link 
            className="RecipeReview-update-link btn btn-secondary font-weight-bold mr-3" 
            to={`/recipes/reviews/${reviewId}/edit`}
            state={{recipeId, recipeName}}
            >
              Update Review
            </Link>
        }
      </div>
    </section>
  );
}

export default RecipeReview;