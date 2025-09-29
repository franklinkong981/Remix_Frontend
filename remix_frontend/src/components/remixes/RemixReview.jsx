import React from "react";
import { Link } from "react-router-dom";

import "./RemixReview.css";

/**
 * Shows a review of a remix, includes the name of the remix that was reviewed, the title, content, and date/time the remix review was created. 
 * Name of the remix will be a link to the remix details page.
 * Rendered by the RemixReviewList component.
 */
function RemixReview({remixId, remixName, title, content, createdAt}) {

  return (
    <section className="RemixReview card">
      <div className="RemixReview-content card-body">
        <h3 className="RemixReview-recipe-name">Review of {remixName}</h3>
        <h1 className="RemixReview-title card-title">
          {title}
        </h1>
        <p className="RemixReview-content">{content}</p>
        <p className="RemixReview-createdAt">Created on {createdAt}</p>
      </div>
    </section>
  );
}

export default RemixReview;