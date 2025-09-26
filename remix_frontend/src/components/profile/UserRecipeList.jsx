import React, {useState, useEffect} from "react";

import RecipeList from "../recipes/RecipeList.jsx";
import RemixApi from "../../api/api.js";

import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the list of recipes belonging to a specific user.
 * When page loads, loads the list of recipes belonging to the user and displays them.
 * 
 * Route: /users/:username/recipes
 * 
 * Contains RecipeList component.
 */
function UserRecipeList() {
  const [listOfRecipes, setListOfRecipes] = useState(null);

  // Retrieve user's recipes data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the recipe list is retrieved, displays them each as a RecipeCard component in a RecipeList component
  useEffect(function loadRecipesWhenMounted() {
    async function fetchRecipes() {
      const userRecipes = await RemixApi.getAllUsersRecipes();
      setListOfRecipes(userRecipes);
    }
    fetchRecipes();
  }, []);
  
  return (
    <div className="UserRecipeList">
      
    </div>
  );
}

export default UserRecipeList;