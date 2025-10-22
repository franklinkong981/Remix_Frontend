import React, {useState, useEffect} from "react";

import {useParams} from "react-router-dom";

import RecipeList from "../recipes/RecipeList.jsx";
import RemixApi from "../../api/api.js";

//import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the list of a user's favorite recipes.
 * When page loads, loads the list of favorite recipes as a RecipeList component and displays them.
 * 
 * Route: /users/:username/favorites/recipes
 * 
 * Contains RecipeList component.
 */
function UserFavoriteRecipesList() {
  const params = useParams();
  const [favoriteRecipesList, setFavoriteRecipesList] = useState(null);

  // Retrieve user's favorite recipes data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the favorite recipe list is retrieved, displays them each as a RecipeCard component in a RecipeList component.
  useEffect(function loadRecipesWhenMounted() {
    async function fetchFavoriteRecipes() {
      const favoriteRecipes = await RemixApi.getFavoriteRecipes(params.username);
      setFavoriteRecipesList(favoriteRecipes);
    }
    fetchFavoriteRecipes();
  }, []);

  //if favoriteRecipesList is empty, will still be truthy, so won't show loading screen.
  if (!favoriteRecipesList) {
    return <h1 className="UserFavoriteRecipeList-loading">Loading...</h1>
  }
  
  return (
    <div className="UserFavoriteRecipesList">
      <h1 className="UserFavoriteRecipesList-header">Your Favorite Recipes</h1>
      {favoriteRecipesList.length ? (
        <RecipeList recipes={favoriteRecipesList}/>
      ) : <p className="UserFavoriteRecipesList-no-recipes">You currently do not have any favorite recipes.</p>}
    </div>
  );
}

export default UserFavoriteRecipesList;