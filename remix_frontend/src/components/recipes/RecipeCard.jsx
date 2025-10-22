import React, {useState, useEffect, useContext} from "react";
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
 * 
 * In addition, there will be a button at the bottom to either add the recipe to the user's list of favorite recipes
 * or remove it from the user's list of favorite recipes.
 */
function RecipeCard({id, name, description, recipeAuthor="", imageUrl, createdAt}) {
  const {currentUserInfo, isRecipeInFavorites, addRecipeToFavorites, removeRecipeFromFavorites} = useContext(CurrentUserContext);

  const [isFavorite, setIsFavorite] = useState();

  //When user adds/removes the recipe from their favorites list, isRecipeInFavorites function return value 
  // is updated in the context, which udpates the text on the Favorites button.
  useEffect(function updateIsFavoriteStatus() {
    setIsFavorite(isRecipeInFavorites(id))
  }, [id, isRecipeInFavorites]);

  async function handleFavoritesClick(evt) {
    if (isFavorite) {
      if (!(isRecipeInFavorites(id))) return;
      await removeRecipeFromFavorites(id);
      setIsFavorite(false);
    } else {
      if (isRecipeInFavorites(id)) return;
      await addRecipeToFavorites(id);
      setIsFavorite(true);
    }
  }

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
        <button 
          className="RecipeCard-favorite-button btn btn-danger font-weight-bold float-right"
          onClick={handleFavoritesClick}>
            {isFavorite ? "Remove From Favorites" : "Add to Favorites"}
        </button>
      </div>
    </section>
  );
}

export default RecipeCard;