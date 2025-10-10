import React, {useContext} from "react";
import { Link } from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import "./RecipeCard.css";

/**
 * Shows basic information about a recipe such as its name, description, image, and when it was created, as a sort of preview of the recipe. 
 * Clicking on the card will take you to the recipe details page.
 * 
 * For RecipeCards of recipes belonging to the logged in user, there will also be a button to edit the recipe.
 * 
 * Rendered by RecipeList component to show a card for each recipe.
 */
function RecipeCard({id, name, description, recipeAuthor="", imageUrl, createdAt}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

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
        {recipeAuthor && <p className="RecipeCard-author">Created by {recipeAuthor}</p>}
        <p className="RecipeCard-createdAt">Created on {createdAt}</p>
        { ((!recipeAuthor) || recipeAuthor == currentUserInfo.username) && <Link 
            className="RecipeCard-update-link btn btn-secondary font-weight-bold mr-3" 
            to={`/recipes/${id}/edit`}
            >
              Update Recipe
            </Link>
        }
      </div>
    </section>
  );
}

export default RecipeCard;