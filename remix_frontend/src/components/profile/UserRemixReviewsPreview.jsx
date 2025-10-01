import React, {useContext} from "react";

import {Link} from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import RemixReviewList from "../recipes/RemixReviewList.jsx";

//import {v4 as uuidv4} from "uuid";

/**
 * Component for the main page of a user's profile that displays the user's most recently added remix review,
 * followed by a button to the user's full list of remix reviews.
 * 
 * The remix review will be passed in as a prop.
 * 
 * Contains RemixReviewList component.
 */
function UserRemixReviewsPreview({remixReview}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

  //tests to see whether remixReview is an object with properties or not.
  const isRemixReviewValid = (remixReview !== null) && (typeof remixReview === 'object') && (Object.keys(remixReview).length > 0);

  return (
    <div className="UserRemixReviewsPreview">
      <h1 className="UserRemixReviewsPreview-header">Your Newest Remix Review</h1>
      {isRemixReviewValid ? (
        <>
          <RemixReviewList remixReviews={[remixReview]}/>
          <Link className="UserRemixReviewsPreview-all-remix-reviews btn btn-secondary font-weight-bold mr-3" to={`/users/${currentUserInfo.username}/reviews/remixes`}>
            See All Your Remix Reviews
          </Link>
        </>
      ) : <p className="UserRemixReviewsPreview-no-remixes">You currently do not have any remi reviews.</p>}
      <hr />
    </div>
  );
}

export default UserRemixReviewsPreview;