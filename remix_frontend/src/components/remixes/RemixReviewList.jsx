import React, {useState, useEffect} from "react";

import RemixReview from "./RemixReview.jsx";

import {v4 as uuidv4} from "uuid";

/**
 * Component that shows a list of remix reviews, with each remix review being a RemixReview component.
 * Is used for pages that show a specific list of remix reviews (ex. all remix reviews belonging to a specific user).
 * 
 * No state in this component, the list of remix reviews (an array of remix review objects) to display is passed in.
 * 
 * Contains RemixReview components.
 */
function RemixReviewList({remixReviews}) {
  return (
    <div className="RemixReviewList col-md-8 offset-md-2">
      {remixReviews.length ? (
        <div className="RemixReviewList-list">
          {remixReviews.map(remixReview => (
            <RemixReview key={uuidv4()}
              reviewId={remixReview.id}
              reviewAuthor={recipeReview.reviewAuthor || ""} 
              remixId={remixReview.remixId} 
              remixName={remixReview.remixName}
              title={remixReview.title}
              content={remixReview.content} 
              createdAt={remixReview.createdAt}
            />
          ))}
        </div>
      ) : <p className="RemixReviewList-no-remix-reviews">No remix reviews found.</p>}
    </div>
  );
}

export default RemixReviewList;