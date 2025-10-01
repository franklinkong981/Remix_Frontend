import React, {useContext} from "react";

import {Link} from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import RemixList from "../remixes/RemixList.jsx";

//import {v4 as uuidv4} from "uuid";

/**
 * Component for the main page of a user's profile that displays the user's 3 most recently created remixes.
 * Contains the 3 most recently created remixes for the user as a RemixList component, followed by a button to 
 * the user's full list of remixes.
 * 
 * The list of remixes will be passed in as a prop.
 * 
 * Contains RemixList component.
 */
function UserRemixesPreview({remixes}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

  return (
    <div className="UserRemixesPreview">
      <h1 className="UserRemixesPreview-header">Your Newest Remixes</h1>
      {remixes.length ? (
        <>
          <RemixList remixes={remixes}/>
          <Link className="UserRemixesPreview-all-remixes btn btn-secondary font-weight-bold mr-3" to={`/users/${currentUserInfo.username}/remixes`}>
            See All Your Remixes
          </Link>
        </>
      ) : <p className="UserRemixesPreview-no-remixes">You currently have not created any remixes.</p>}
      <hr />
    </div>
  );
}

export default UserRemixesPreview;