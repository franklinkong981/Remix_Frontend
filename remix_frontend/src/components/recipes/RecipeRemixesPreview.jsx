import React from "react";

import {Link} from "react-router-dom";

import RemixList from "../remixes/RecipeReviewList.jsx";

//import {v4 as uuidv4} from "uuid";

/**
 * Component for the details page of a recipe that contains up to the 3 most recently added remixes of the recipe.
 * Also contains a link to the page that displays the full list of remixes belonging to the recipe.
 * 
 * The recipe id (used for link to page for all remixes of the recipe) and remixes object containing information about the remixes will be passed in as props.
 * 
 * Contains RemixList component.
 */
function RecipeRemixesPreview({recipeId, recipeName, remixes}) {

  return (
    <div className="RecipeRemixesPreview">
      <h1 className="RecipeRemixesPreview-header">Newest Remixes for {recipeName}</h1>
      {remixes.length ? (
        <>
          <RemixList remixes={[remixes]}/>
          <Link className="RecipeRemixesPreview-all-remixes btn btn-secondary font-weight-bold mr-3" 
                to={`/recipes/${recipeId}/remixes`}
                state={{recipeId, recipeName}}
          >
            See All Remixes for this Recipe
          </Link>
        </>
      ) : <p className="RecipeRemixesPreview-no-remixes">This recipe currently does not have any remix reviews.</p>}
      <hr />
    </div>
  );
}

export default RecipeRemixesPreview;