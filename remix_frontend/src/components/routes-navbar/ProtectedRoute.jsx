import React, {useContext} from "react";
import {Route, Navigate} from "react-router-dom";
import CurrentUserContext from "../../contexts/currentUserContext.jsx";

/**
 * Component for private routes. A user must be logged in to access this route.
 * 
 * Each time a ProtectedRoute is loaded, checks CurrentUserContext for currentUserInfo.
 * If currentUserInfo is null, that means no user is currently logged in, 
 * so you are automatically redirected to the login page.
 */
function ProtectedRoute({children}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

  if (!currentUserInfo) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      {children}
    </div>
  );
}

export default ProtectedRoute;