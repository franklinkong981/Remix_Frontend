import React, {useState, useEffect} from "react";

import {useParams, useLocation, Link} from "react-router-dom";

import RemixReviewList from "./RemixReviewList.jsx";
import RemixApi from "../../api/api.js";

//import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the full list of remix reviews belonging to a specific remix.
 * When page loads, loads the list of remix reviews belonging to the remix and displays them.
 * 
 * Route: /remixes/:remixId/reviews
 * 
 * Contains RemixReviewList component.
 */
function FullRemixReviewList() {
  const params = useParams();
  const location = useLocation();
  //locationRemix = state passed in from the /remixes/:remixId aka remix details page route, contains {remixId, remixName}
  const locationRecipe = location.state;
  const [listOfRemixReviews, setListOfRemixReviews] = useState(null);

  // Retrieve remix's reviews data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the remix review list is retrieved, displays them each as a RemixReview component in a RemixReviewList component.
  useEffect(function loadRecipeReviewsWhenMounted() {
    async function fetchRecipeReviews() {
      const allRecipeReviews = await RemixApi.getAllRecipeReviews(params.recipeId);
      setListOfRecipeReviews(allRecipeReviews);
    }
    fetchRecipeReviews();
  }, []);

  //if listOfRecipeReviews is empty, will still be truthy, so won't show loading screen.
  if (!listOfRecipeReviews) {
    return <h1 className="FullRecipeReviewList-loading">Loading...</h1>
  }
  
  return (
    <div className="FullRecipeReviewList">
      <h1 className="FullRecipeReviewList-header">
        All Recipe Reviews for <Link className="FullRecipeReviewList-details-page-link" to={`/recipes/${locationRecipe.recipeId}`}>
          {locationRecipe.recipeName}
        </Link>
      </h1>
      {listOfRecipeReviews.length ? (
        <RecipeReviewList recipeReviews={listOfRecipeReviews}/>
      ) : <p className="FullRecipeReviewList-no-reviews">This recipe currently doesn't have any recipe reviews.</p>}
    </div>
  );
}

export default FullRemixReviewList;