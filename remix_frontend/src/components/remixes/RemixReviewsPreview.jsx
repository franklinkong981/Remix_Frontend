import React from "react";

import {Link} from "react-router-dom";

import RemixReviewList from "./RemixReviewList.jsx";

//import {v4 as uuidv4} from "uuid";

/**
 * Component for the details page of a remix that contains the most recently added review of the remix.
 * Also contains a link to the page that displays the full list of reviews belonging to the remix.
 * 
 * The remix id (used for link to page for all remix reviews) and remix review object containing information about the review will be passed in as props.
 * 
 * Contains RemixReviewList component.
 */
function RemixReviewsPreview({remixId, remixName, remixReview}) {

  // tests to see whether remixReview is an object with properties or not. If the remix doesn't have any remix reviews, 
  // the remixReview object prop will be empty.
  const isRemixReviewValid = (remixReview !== null) && (typeof remixReview === 'object') && (Object.keys(remixReview).length > 0);

  return (
    <div className="RemixReviewsPreview">
      <h1 className="RemixReviewsPreview-header">Newest Review for {remixName}</h1>
      {isRemixReviewValid ? (
        <>
          <RemixReviewList remixReviews={[remixReview]}/>
          <Link className="RemixReviewsPreview-all-remix-reviews btn btn-secondary font-weight-bold mr-3" 
                to={`/remixes/${remixId}/reviews`}
                state={{remixId, remixName}}
          >
            See All Reviews for this Remix
          </Link>
        </>
      ) : <p className="RecipeReviewsPreview-no-remixes">This remix currently does not have any remix reviews.</p>}
      <hr />
    </div>
  );
}

export default RemixReviewsPreview;