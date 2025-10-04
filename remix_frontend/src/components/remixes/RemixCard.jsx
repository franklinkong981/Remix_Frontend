import React from "react";
import { Link } from "react-router-dom";

import "./RemixCard.css";

/**
 * Shows basic information about a remix such as its name, description, image, and when it was created, as a sort of preview of the remix.
 * Also shows the name of the recipe it's a remix of. 
 * Also contains a link that will take you to the remix details page.
 * Rendered by RemixList component to show a card for each remix.
 * 
 * Depending on the page it's on, may contain either the author of the remix or the original recipe it's a remix of.
 * If it's on the recipes details page, it will contain the remixAuthor but not the originalRecipe. If it's on the user profile page,
 * it will contain the originalRecipe but not the remixAuthor.
 */
function RemixCard({id, name, description, remixAuthor="", originalRecipe = "", imageUrl, createdAt}) {

  return (
    <section className="RemixCard card">
      <img class="RemixCard-image card-img-top" src={imageUrl} alt={`Picture of ${name}`}></img>
      <div className="RemixCard-content card-body">
        <h3 className="RemixCard-title card-title">
          {name}
        </h3>
        <p className="RemixCard-description">{description}</p>
        {originalRecipe && <p className="RemixCard-original-recipe">Remix of {originalRecipe}</p>}
        {remixAuthor && <p className="RemixCard-author">Created by {remixAuthor}</p>}
        <p className="RemixCard-createdAt">Created on {createdAt}</p>
      </div>
    </section>
  );
}

export default RemixCard;