import React, {useState, useEffect} from "react";

import RemixCard from "./RemixCard.jsx";

import {v4 as uuidv4} from "uuid";

/**
 * Component that shows a list of remixes, with each remix being a RemixCard component.
 * Is used for pages that show a specific list of remixes.
 * 
 * No state in this component, the list of remixes (an array of remix objects) to display is passed in.
 * 
 * Contains RemixCard components.
 */
function RemixList({remixes}) {
  return (
    <div className="RemixList col-md-8 offset-md-2">
      {remixes.length ? (
        <div className="RemixList-list">
          {remixes.map(remix => (
            <RemixCard key={uuidv4()} 
              id={remix.id} 
              name={remix.name} 
              description={remix.description}
              originalRecipe={remix.originalRecipe || ""}
              remixAuthor={remix.remixAuthor || ""}
              imageUrl={remix.imageUrl}
              createdAt={remix.createdAt}
            />
          ))}
        </div>
      ) : <p className="RemixList-no-remixes">No remixes found</p>}
    </div>
  );
}

export default RemixList;