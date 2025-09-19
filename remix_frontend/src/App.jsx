/** The top-level component of the Remix app.
*/

import React, {useState, useEffect} from "react";

import { jwtDecode } from "jwt-decode";

import RemixApi from "./api/api.js";

import RemixNavbar from "./components/routes-navbar/RemixNavbar.jsx";
import RemixRoutes from "./components/routes-navbar/RemixRoutes.jsx";

import useLocalStorage from "./hooks/useLocalStorage.jsx";

import CurrentUserContext from "./contexts/currentUserContext.jsx";

export const TOKEN_STORAGE_ID = "remix-token";

/** 
 * userInfoLoaded: Has currently logged in user's data been returned from API? If not, display loading text on screen.
 * currentUserInfo: Object containing user information from API, this is used to determine if someone is logged in.
 * token: JWT for logged in users, most API calls will require this in the headers. 
 * token is initially read from localStorage when the page is first loaded/refreshed, if not there it will be set to null.
 * 
 * App contains the Routes component.
*/
function App() {
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);
  const [userToken, setUserToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  useEffect(function getUserInfoUponTokenChange() {
    //Load user information from the RemixApi. Only depends on userToken (payload = {userId, username, email})
    //since this only needs to run when user logs in or logs out.
    async function getCurrentUserInfo() {
      if (userToken) {
        try {
          //put token in RemixApi class so we can use it to make API calls to the backend.
          RemixApi.token = userToken;
          let currentUserPayload= jwtDecode(userToken);
          let currentUser = await RemixApi.getCurrentLoggedInUser(currentUserPayload.username);
          setCurrentUserInfo(currentUser);
        } catch(err) {
          console.error("Problem encountered while fetching new current user information: ", err);
          setCurrentUserInfo(null);
        }
      }
      setUserInfoLoaded(true);
    }

    setUserInfoLoaded(false);
    getCurrentUserInfo();

  }, [userToken]);

  /**
   * Handles account signup. 
   * signUpFormValues = object containing values from SignUpForm submission.
   */
  const signUpNewUser = async (signUpFormValues) => {
    try {
      console.log(signUpFormValues);
      let signUpToken = await RemixApi.signUp(signUpFormValues);
      setUserToken(userToken => signUpToken);
      return {signUpSuccessful: true};
    } catch(errors) {
      console.error("User signup failed: ", errors);
      return {signUpSuccessful: false, errors};
    }
  };

  /**
   * Handles account login.
   * loginFormValues = object containing values from LoginForm submission.
   */
  const loginUser = async (loginFormValues) => {
    try {
      console.log(loginFormValues);
      let loginToken = await RemixApi.login(loginFormValues);
      console.log(loginToken);
      setUserToken(userToken => loginToken);
      return {loginSuccessful: true};
    } catch(errors) {
      console.error("User login failed", errors);
      return {loginSuccessful: false, errors};
    }
  };

  /**
   * Handles user logout. Sets currently logged in user info and userToken
   * to null since there is now no user is logged in.
   */
  const logoutUser = () => {
    setCurrentUserInfo(currentUserInfo => null);
    setUserToken(userToken => null);
  };

  //When the page is first loaded, "Loading" will be displayed while the currently logged in user (if applicable)'s information is being fetched.
  if (!userInfoLoaded) return (
    <div className="App">
      <h1>Loading...</h1>
    </div>
  )

  return (
    <CurrentUserContext.Provider value={{currentUserInfo, setCurrentUserInfo}}>
      <div className="App">
        <RemixNavbar logOutFunc={logoutUser} />
        <RemixRoutes signUpFunc={signUpNewUser} loginFunc={loginUser} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;