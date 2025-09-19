import React, {useContext} from "react";
import { Link, NavLink } from "react-router-dom";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

import "./RemixNavbar.css";

/**
 * Navigation bar for the site, and shows up on every page.
 * Rendered by the top-level App component.
 * 
 * When user is logged in, shows links to the homepage (user's profile page), as well as links to list of logged in user's recipes,
 * remixes, and recipes/remix reviews, along with the log out link which runs the logOutFunc function prop to log the user out upon being clicked.
 * 
 * When logged out, will show links to the sign up and login forms.
 * 
 * Both logged in and logged out navbars will have the Remix logo displayed on the left which redirects to the homepage.
 */
function RemixNavbar({logOutFunc}) {
  const {currentUserInfo} = useContext(CurrentUserContext);

  function loggedInNavbar() {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link logout-link" to="/" onClick={logOutFunc}>
            Log out
          </Link>
        </li>
      </ul>
    );
  }

  function loggedOutNavbar() {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/login">
            Log In
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav className="RemixNavbar navbar navbar-expand-md">
      <Link className="navbar-brand" to="/">
        Remix Home
      </Link>
      {currentUserInfo ? loggedInNavbar() : loggedOutNavbar()}
    </nav>
  );
}

export default RemixNavbar;