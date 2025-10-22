import React, {useState, useEffect} from "react";

import {useParams} from "react-router-dom";

import RemixList from "../remixes/RemixList.jsx";
import RemixApi from "../../api/api.js";

//import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the list of a user's favorite remixes.
 * When page loads, loads the list of favorite remixes as a RemixList component and displays them.
 * 
 * Route: /users/:username/favorites/remixes
 * 
 * Contains RemixList component.
 */
function UserFavoriteRemixesList() {
  const params = useParams();
  const [favoriteRemixesList, setFavoriteRemixesList] = useState(null);

  // Retrieve user's favorite remixes data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the favorite remix list is retrieved, displays them each as a RemixCard component in a RemixList component.
  useEffect(function loadRemixesWhenMounted() {
    async function fetchFavoriteRemixes() {
      const favoriteRemixes = await RemixApi.getFavoriteRemixes(params.username);
      setFavoriteRemixesList(favoriteRemixes);
    }
    fetchFavoriteRemixes();
  }, []);

  //if favoriteRemixesList is empty, will still be truthy, so won't show loading screen.
  if (!favoriteRemixesList) {
    return <h1 className="UserFavoriteRemixesList-loading">Loading...</h1>
  }
  
  return (
    <div className="UserFavoriteRemixesList">
      <h1 className="UserFavoriteRemixesList-header">Your Favorite Remixes</h1>
      {favoriteRemixesList.length ? (
        <RemixList remixes={favoriteRemixesList}/>
      ) : <p className="UserFavoriteRemixesList-no-remixes">You currently do not have any favorite remixes.</p>}
    </div>
  );
}

export default UserFavoriteRemixesList;