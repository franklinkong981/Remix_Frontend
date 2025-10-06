import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import RemixApi from "../../api/api.js";

import RemixReviewsPreview from "./RemixReviewsPreview.jsx";

/**
 * Remix Details page top-level component.
 * This is the page that shows full detailed information about a remix including ingredients, directions, number of servings, cooking time,
 * the user who created it, etc. which will then be followed by the most recently added review of the remix as a RemixReviewsPreview component, which contains
 * a link to the page that lists out all remix reviews of the remix.
 * 
 * Route is /remixes/:remixId
 * 
 * Contains the RemixReviewsPreview component.
 * 
 */
function RemixDetail() {
  const {remixId} = useParams();
  const [remixDetailedInfo, setRemixDetailedInfo] = useState(null);

  //retrieve detailed info about remix, including its  most recently added review from the Remix API.
  // While this is happening, the word "Loading" is displayed on the screen. Remix information won't be displayed 
  // until the detailed information of the remix is returned from the API.
  useEffect(function loadRemixDetailsWhenMounted() {
    async function fetchRemixDetails() {
      const remix = await RemixApi.getRemixDetails(remixId);
      setRemixDetailedInfo(remix);
    }
    fetchRemixDetails();
  }, [remixId]);

  if (!remixDetailedInfo) return <h1>Loading...</h1>

  return (
    <div className="RemixDetail col-md-8 offset-md-2">
      <img className="RemixDetail-image" src={remixDetailedInfo.imageUrl} alt={`Picture of ${remixDetailedInfo.name}`}></img>
      <h1 className="RemixDetail-name">{remixDetailedInfo.name}</h1>
      <h2 className="RemixDetail-description">{remixDetailedInfo.description}</h2>
      <p className="RemixDetail-original-recipe">Remix of 
        <Link className="RemixDetail-original-recipe-link font-weight-bold" to={`/recipes/${remixDetailedInfo.originalRecipeId}`}>
          {remixDetailedInfo.originalRecipe}
        </Link>
      </p>
      <p className="RemixDetail-author">Created by {remixDetailedInfo.remixAuthor} on {remixDetailedInfo.createdAt}.</p>
      <hr />
      <h3 className="RemixDetails-details-header">Recipe Details:</h3>
      <p className="RemixDetails-purpose">Purpose of this remix: {remixDetailedInfo.purpose}</p>
      <p className="RemixDetails-ingredients">Ingredients: {remixDetailedInfo.ingredients}</p>
      <p className="RemixDetails-directions">Instructions: {remixDetailedInfo.directions}</p>
      <p className="RemixDetails-cooking-time">Cooking Time: {remixDetailedInfo.cookingTime > 0 ? remixDetailedInfo.cookingTime : "N/A"}</p>
      <p className="RemixDetails-servings">Servings: {remixDetailedInfo.servings > 0 ? remixDetailedInfo.servings : "N/A"}</p>
      <hr />
      <RemixReviewsPreview remixId={remixDetailedInfo.id} remixName={remixDetailedInfo.name} remixReview={remixDetailedInfo.mostRecentRemixReview}/>
    </div>
  );
}


export default RemixDetail;