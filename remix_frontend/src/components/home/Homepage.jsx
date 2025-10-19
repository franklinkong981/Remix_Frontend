import React, {useContext} from "react";
import {Link} from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import UserRecipesPreview from "../profile/UserRecipesPreview.jsx";
import UserRecipeReviewsPreview from "../profile/UserRecipeReviewsPreview.jsx";
import UserRemixesPreview from "../profile/UserRemixesPreview.jsx";
import UserRemixReviewsPreview from "../profile/UserRemixReviewsPreview.jsx";

import "./Homepage.css";

/**
 * Homepage of site. Top-level component of the route /.
 * 
 * If user is logged in, will display a welcome message with their name, show some of their recipes, remixes, and recipe/remix reviews
 * with links to the pages to see all their recipes, remixes, and recipe/remix reviews.
 * In addition, will have 2 searchbars at the top of the page: One to search for recipes and one to search for users.
 * 
 * If user is logged out, will display a welcome message with links to the signup and login forms.
 */
function Homepage() {
  const {currentUserInfo} = useContext(CurrentUserContext);

  return (
    <div className="Homepage">
      {currentUserInfo ? (
        <div className="Homepage-logged-in container text-center">
          <h1 className="Homepage-logged-in-title mb-4 font-weight-bold">Welcome back {currentUserInfo.username}!</h1>
          <p className="Homepage-logged-in-subtitle lead">See your recipes, remixes, and reviews below.</p>
          <div className="Homepage-logged-in-links">
            <Link className="Homepage-logged-in-search-link btn btn-secondary font-weight-bold mr-3" to={`/recipes`}>
              Search Recipes
            </Link>
            <Link className="Homepage-logged-in-add-recipes-link btn btn-secondary font-weight-bold mr-3" to={`/recipes/new`}>
              Add New Recipe
            </Link>
          </div>
          <hr />
          <UserRecipesPreview recipes={currentUserInfo.recipes}/>
          <UserRecipeReviewsPreview recipeReview={currentUserInfo.recipeReview} />
          <UserRemixesPreview remixes={currentUserInfo.remixes} />
          <UserRemixReviewsPreview remixReview={currentUserInfo.remixReview} />
        </div>
      ) : (
        <div className="Homepage-logged-out container text-center">
          <h1 className="Homepage-logged-out-title mb-4 font-weight-bold">Welcome to Remix!</h1>
          <p className="Homepage-logged-out-subtitle lead">Create Your Own Recipes or Modified Versions of Other Recipes!</p>
          <div className="Homepage-logged-out-links">
            <Link className="Homepage-logged-out-login-link btn btn-secondary font-weight-bold mr-3" to="/login">
              Log In
            </Link>
            <Link className="Homepage-logged-out-signup-link btn btn-info font-weight-bold" to="/signup">
              Create An Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;