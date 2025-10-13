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
  const {remixId} = useParams();
  const location = useLocation();
  //locationRemix = state passed in from the /remixes/:remixId aka remix details page route, contains {remixId, remixName}
  const locationRemix = location.state;
  const [listOfRemixReviews, setListOfRemixReviews] = useState(null);

  // Retrieve remix's reviews data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the remix review list is retrieved, displays them each as a RemixReview component in a RemixReviewList component.
  useEffect(function loadRemixReviewsWhenMounted() {
    async function fetchRemixReviews() {
      const allRemixReviews = await RemixApi.getAllRemixReviews(remixId);
      setListOfRemixReviews(allRemixReviews);
    }
    fetchRemixReviews();
  }, []);

  //if listOfRemixReviews is empty, will still be truthy, so won't show loading screen.
  if (!listOfRemixReviews) {
    return <h1 className="FullRemixReviewList-loading">Loading...</h1>
  }
  
  return (
    <div className="FullRemixReviewList">
      <h1 className="FullRemixReviewList-header">
        All Remix Reviews for <Link className="FullRemixReviewList-details-page-link" to={`/remixes/${remixId}`}>
          {locationRemix.remixName}
        </Link>
      </h1>
      {listOfRemixReviews.length ? (
        <RemixReviewList remixReviews={listOfRemixReviews}/>
      ) : <p className="FullRemixReviewList-no-reviews">This remix currently doesn't have any remix reviews.</p>}
    </div>
  );
}

export default FullRemixReviewList;