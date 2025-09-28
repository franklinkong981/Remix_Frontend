import React, {useState, useEffect} from "react";

import {useParams} from "react-router-dom";

import RemixList from "../remixes/RemixList.jsx";
import RemixApi from "../../api/api.js";

//import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the list of remixes belonging to a specific user.
 * When page loads, loads the list of remixes belonging to the user and displays them.
 * 
 * Route: /users/:username/remixes
 * 
 * Contains RemixList component.
 */
function UserRemixList() {
  const params = useParams();
  const [listOfRemixes, setListOfRemixes] = useState(null);

  // Retrieve user's remixes data from database. While this is happening,
  // the "loading" text appears on the page.
  // After the remix list is retrieved, displays them each as a RemixCard component in a RemixList component
  useEffect(function loadRemixesWhenMounted() {
    async function fetchRemixes() {
      const userRemixes = await RemixApi.getUsersRemixes(params.username);
      setListOfRemixes(userRemixes);
    }
    fetchRemixes();
  }, []);

  //if listOfRemixes is empty, will still be truthy, so won't show loading screen.
  if (!listOfRemixes) {
    return <h1 className="UserRemixList-loading">Loading...</h1>
  }
  
  return (
    <div className="UserRemixList">
      <h1 className="UserRemixList-header">Your Remixes</h1>
      {listOfRemixes.length ? (
        <RemixList recipes={listOfRemixes}/>
      ) : <p className="UserRemixList-no-remixes">You currently have not created any remixes.</p>}
    </div>
  );
}

export default UserRemixList;