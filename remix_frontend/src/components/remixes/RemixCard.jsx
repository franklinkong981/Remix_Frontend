import React, {useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

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
 * 
 * In addition, there will be a button at the bottom to either add the remix to the user's list of favorite remixes
 * or remove it from the user's list of favorite remixes.
 */
function RemixCard({id, name, description, remixAuthor="", originalRecipe = "", imageUrl, createdAt}) {
  const {currentUserInfo, isRemixInFavorites, addRemixToFavorites, removeRemixFromFavorites} = useContext(CurrentUserContext);

  const [isFavorite, setIsFavorite] = useState();
  
  //When user adds/removes the remix from their favorites list, isRemixInFavorites function return value 
  // is updated in the context, which udpates the text on the Favorites button.
  useEffect(function updateIsFavoriteStatus() {
    setIsFavorite(isRemixInFavorites(id))
  }, [id, isRemixInFavorites]);

  async function handleFavoritesClick(evt) {
    if (isFavorite) {
      if (!(isRemixInFavorites(id))) return;
      await removeRemixFromFavorites(id);
      setIsFavorite(false);
    } else {
      if (isRemixInFavorites(id)) return;
      await addRemixToFavorites(id);
      setIsFavorite(true);
    }
  }

  return (
    <section className="RemixCard card">
      <img class="RemixCard-image card-img-top" src={imageUrl} alt={`Picture of ${name}`}></img>
      <div className="RemixCard-content card-body">
        <h3 className="RemixCard-title card-title">
          <Link className="RemixCard-link font-weight-bold" to={`/remixes/${id}`}>
            {name}
          </Link>
        </h3>
        <p className="RemixCard-description">{description}</p>
        {originalRecipe && <p className="RemixCard-original-recipe">Remix of {originalRecipe}</p>}
        {remixAuthor && <p className="RemixCard-author">Created by {remixAuthor}</p>}
        <p className="RemixCard-createdAt">Created on {createdAt}</p>
        { ((!remixAuthor) || remixAuthor == currentUserInfo.username) && <Link 
          className="RemixCard-update-link btn btn-secondary font-weight-bold mr-3" 
          to={`/remixes/${id}/edit`}
          state={{name}}
          >
            Update Remix
          </Link>
        }
        <button 
          className="RemixCard-favorite-button btn btn-danger font-weight-bold mr-3"
          onClick={handleFavoritesClick}>
            {isFavorite ? "Remove From Favorites" : "Add to Favorites"}
        </button>
      </div>
    </section>
  );
}

export default RemixCard;