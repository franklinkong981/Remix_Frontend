import React, {useState, useEffect} from "react";

import {useParams} from "react-router-dom";

import RemixReviewList from "../remixes/RemixReviewList.jsx";
import RemixApi from "../../api/api.js";

//import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the list of remix reviews belonging to a specific user.
 * When page loads, loads the list of remix reviews belonging to the user and displays them.
 * 
 * Route: /users/:username/reviews/remixes
 * 
 * Contains RemixReviewList component.
 */
function UserRemixReviewList() {
  const params = useParams();
  const [listOfRemixReviews, setListOfRemixReviews] = useState(null);

  // Retrieve user's remix reviews data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the remix review list is retrieved, displays them each as a RemixReview component in a RemixReviewList component
  useEffect(function loadRemixReviewsWhenMounted() {
    async function fetchRemixReviews() {
      const userRemixReviews = await RemixApi.getUsersRemixReviews(params.username);
      setListOfRemixReviews(userRemixReviews);
    }
    fetchRemixReviews();
  }, []);

  //if listOfRemixReviews is empty, will still be truthy, so won't show loading screen.
  if (!listOfRemixReviews) {
    return <h1 className="UserRemixReviewList-loading">Loading...</h1>
  }
  
  return (
    <div className="UserRemixReviewList">
      <h1 className="UserRemixReviewList-header">Your Remix Reviews</h1>
      {listOfRemixReviews.length ? (
        <RemixReviewList remixReviews={listOfRemixReviews}/>
      ) : <p className="UserRemixReviewList-no-reviews">You currently don't have any remix reviews.</p>}
    </div>
  );
}

export default UserRemixReviewList;