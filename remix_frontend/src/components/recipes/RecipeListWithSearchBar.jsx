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
   * Filters companies to display that match the search query, triggered upon search bar submission.
   * Calls the API to return filtered companies and reloads the CompanyList component which now only displays filtered companies.
   */
  const filterCompanySearch = async (searchQuery) => {
    let filteredCompanies;
    if (searchQuery) {
      filteredCompanies = await JoblyApi.getFilteredCompaniesByName(searchQuery);
    } else {
      filteredCompanies = await JoblyApi.getAllCompanies();
    }

    setListOfCompanies(listOfCompanies => filteredCompanies);
  };
  
  if (!listOfCompanies) {
    return <h1>Loading...</h1>
  }
  
  return (
    <div className="CompanyList col-md-8 offset-md-2">
      <SearchBar filterFunc={filterCompanySearch} placeholder="Search for companies"/>
      {listOfCompanies.length ? (
        <div className="CompanyList-list">
          {listOfCompanies.map(company => (
            <CompanyCard id={company.handle} name={company.name} description={company.description} key={uuidv4()}/>
          ))}
        </div>
      ) : <p className="CompanyList-no-companies">No companies found</p>}
    </div>
  );
}

export default RecipeListWithSearchBar;