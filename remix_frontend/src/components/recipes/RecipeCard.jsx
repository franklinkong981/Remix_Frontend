import React from "react";
import { Link } from "react-router-dom";

import "./RecipeCard.css";

/**
 * Shows basic information about a recipe such as its name, description, image, and when it was created, as a sort of preview of the recipe. 
 * Clicking on the card will take you to the recipe details page.
 * 
 * 
 * 
 * Rendered by RecipeList component to show a card for each recipe.
 */
function RecipeCard({id, name, description, imageUrl, createdAt}) {

  return (
    <section className="RecipeCard card">
      <img className="RecipeCard-image card-img-top" src={imageUrl} alt={`Picture of ${name}`}></img>
      <div className="RecipeCard-content card-body">
        <h3 className="RecipeCard-title card-title">
          <Link className="RecipeCard-link font-weight-bold" to={`/recipes/${id}`}>
            {name}
          </Link>
        </h3>
        <p className="RecipeCard-description">{description}</p>
        <p className="RecipeCard-createdAt">Created on {createdAt}</p>
      </div>
    </section>
  );
}

export default RecipeCard;