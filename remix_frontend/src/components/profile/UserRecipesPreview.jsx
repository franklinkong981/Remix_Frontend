import React, {useContext} from "react";

import {Link} from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import RecipeList from "../recipes/RecipeList.jsx";

//import {v4 as uuidv4} from "uuid";

/**
 * Component for the main page of a user's profile that displays the user's 3 most recently created recipes..
 * Contains the 3 most recently created recipes for the user as a RecipeList component, followed by a button to 
 * the user's full list of recipes.
 * 
 * The list of recipes will be passed in as a prop.
 * 
 * Contains RecipeList component.
 */
function UserRecipesPreview({recipes}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

  return (
    <div className="UserRecipesPreview">
      <h1 className="UserRecipesPreview-header">Your Newest Recipes</h1>
      {recipes.length ? (
        <>
          <RecipeList recipes={recipes}/>
          <Link className="UserRecipesPreview-all-recipes btn btn-secondary font-weight-bold mr-3" to={`/users/${currentUserInfo.username}/recipes`}>
            See All Your Recipes
          </Link>
        </>
      ) : <p className="UserRecipesPreview-no-recipes">You currently have not created any recipes.</p>}
      <hr />
    </div>
  );
}

export default UserRecipesPreview;