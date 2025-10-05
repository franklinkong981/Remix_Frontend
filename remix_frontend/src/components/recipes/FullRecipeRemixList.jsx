import React, {useState, useEffect} from "react";

import {useParams, useLocation, Link} from "react-router-dom";

import RemixList from "../remixes/RemixList.jsx";
import RemixApi from "../../api/api.js";

//import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the full list of remixes belonging to a specific recipe.
 * When page loads, loads the list of all remixes belonging to the recipe and displays them.
 * 
 * Route: /recipes/:recipeId/remixes
 * 
 * Contains RemixList component.
 */
function FullRecipeRemixList() {
  const params = useParams();
  const location = useLocation();
  //locationRecipe = state passed in from the /recipes/:recipeId aka recipe details page route, contains {recipeId, recipeName}
  const locationRecipe = location.state;
  const [listOfRecipeRemixes, setListOfRecipeRemixes] = useState(null);

  // Retrieve recipe's remixes data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the recipe remix list is retrieved, displays them each as a RemixCardcomponent in a RemixList component.
  useEffect(function loadRecipeRemixesWhenMounted() {
    async function fetchRecipeRemixes() {
      const allRecipeRemixes = await RemixApi.getAllRecipeRemixes(params.recipeId);
      setListOfRecipeRemixes(allRecipeRemixes);
    }
    fetchRecipeRemixes();
  }, []);

  //if listOfRecipeRemixes is empty, will still be truthy, so won't show loading screen.
  if (!listOfRecipeRemixes) {
    return <h1 className="FullRecipeRemixList-loading">Loading...</h1>
  }
  
  return (
    <div className="FullRecipeRemixList">
      <h1 className="FullRecipeRemixList-header">
        All Remixes for <Link className="FullRecipeRemixList-details-page-link" to={`/recipes/${locationRecipe.recipeId}`}>
          {locationRecipe.recipeName}
        </Link>
      </h1>
      {listOfRecipeRemixes.length ? (
        <RemixList remixes={listOfRecipeRemixes}/>
      ) : <p className="FullRecipeRemixList-no-remixes">This recipe currently doesn't have any remixes.</p>}
    </div>
  );
}

export default FullRecipeRemixList;