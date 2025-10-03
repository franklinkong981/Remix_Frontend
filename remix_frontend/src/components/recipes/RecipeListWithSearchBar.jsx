import React, {useState, useEffect} from "react";

import SearchBar from "../reusables/SearchBar.jsx";
import RecipeList from "./RecipeList.jsx";
import RemixApi from "../../api/api.js";

import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page where logged in users can search for recipes by recipe name.
 * When page loads, all recipes are loaded from the API and displayed in alphabetical order as a RecipeList component of RecipeCard components.
 * Above the RecipeList is a SearchBar. When users type in a search query and click the submit button, only
 * the recipes whose names match/contain the search query (case insensitive) are displayed in alphabetical order.
 * 
 * Route: /recipes
 * 
 * Contains SearchBar, RecipeList (each recipe is displayed in RecipeCard component in the RecipeList).
 */
function RecipeListWithSearchBar() {
  const [listOfRecipes, setListOfRecipes] = useState(null);

  //retrieve recipe data from database. While this is happening,
  // the "loading" text appears on the page.
  // Initial list of all recipes won't be displayed until recipe data is returned from Api.
  useEffect(function loadAllRecipesWhenMounted() {
    async function fetchRecipes() {
      const recipes = await RemixApi.getAllRecipes();
      setListOfRecipes(recipes);
    }
    fetchRecipes();
  }, []);

  /**
   * Filters recipes to display that match the search query, triggered upon clicking the search button.
   * Calls the API to return filtered recipes and reloads the RecipeList component which now only displays filtered recipes whose names
   * match/contain the search query. Matching recipes will still be listed by name in alphabetical order.
   */
  const filterRecipeSearch = async (searchQuery) => {
    let filteredRecipes;
    if (searchQuery) {
      filteredRecipes = await RemixApi.getFilteredRecipesByName(searchQuery);
    } else {
      filteredRecipes = await RemixApi.getAllRecipes();
    }

    setListOfRecipes(listOfRecipes => filteredRecipes);
  };
  
  //listOfRecipes being empty array won't be undefined.
  if (!listOfRecipes) {
    return <h1>Loading...</h1>
  }
  
  return (
    <div className="RecipeListWithSearchBar col-md-8 offset-md-2">
      <SearchBar filterFunc={filterRecipeSearch} placeholder="Search by recipe name"/>
      {listOfRecipes.length ? (
        <RecipeList recipes={listOfRecipes} />
      ) : <p className="RecipeListWithSearchBar-no-recipes">No recipes found. Please search for a different name.</p>}
    </div>
  );
}

export default RecipeListWithSearchBar;