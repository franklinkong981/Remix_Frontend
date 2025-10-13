import React, {useContext} from "react";
import { Link } from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import "./RemixReview.css";

/**
 * Shows a review of a remix, includes the name of the remix that was reviewed, the title, content, and date/time the remix review was created. 
 * Name of the remix will be a link to the remix details page.
 * Rendered by the RemixReviewList component.
 */
function RemixReview({reviewId, reviewAuthor="", remixId, remixName, title, content, createdAt}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

  return (
    <section className="RemixReview card">
      <div className="RemixReview-content card-body">
        {remixName ? (
          <p className="RemixReview-recipe-name">Review of <Link className="RemixReview-link font-weight-bold" to={`/remixes/${remixId}`}>
              {remixName}
            </Link>
          </p>
        ) : null}
        {reviewAuthor ? <p className="RemixReview-remix-author">Created by {reviewAuthor}</p> : null}
        <h1 className="RemixReview-title card-title">
          {title}
        </h1>
        <p className="RemixReview-content">{content}</p>
        <p className="RemixReview-createdAt">Created on {createdAt}</p>
        { ((!reviewAuthor) || reviewAuthor == currentUserInfo.username) && <Link 
            className="RemixReview-update-link btn btn-secondary font-weight-bold mr-3" 
            to={`/remixes/reviews/${reviewId}/edit`}
            state={{remixId, remixName}}
            >
              Update Review
            </Link>
        }
      </div>
    </section>
  );
}

export default RemixReview;