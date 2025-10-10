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
 * 
 * currentUserInfo: Object containing user information from API, this is used to determine if someone is logged in.
 * currentUserInfo contains logged in user's username, email, their 3 most recent recipes, their 3 most recent remixes, their most recen
 * recipe review, and their most recent remix review.
 * 
 * currentUserInfo object layout: {username, email, recipes: [ {id, name, description, imageUrl, createdAt}, ... ], remixes: [ {id, name, description, originalRecipe, imageUrl, createdAt}, ... ],
 *                                recipeReview: {recipeId, recipeName, title, content, createdAt}, remixReivew: {remixId, remixName, title, content, createdAt} } 
 * 
 * userToken: JWT for logged in users, most API calls will require this in the headers. 
 * userToken is initially read from localStorage when the page is first loaded/refreshed, if not there it will be set to null.
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
      let successMessage = await RemixApi.signUp(signUpFormValues);
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

  /**
   * Is triggered by the user submitting the form to add a new recipe. Processes the form values, then calls the RemixAPI with
   * the processed form data, which sends a request to the backend to add the new recipe to the database.
   * If successful, will return an object containing the id of the newly created recipe that was added to the database.
   */
  const addNewRecipe = async (newRecipeFormValues) => {
    try {
      console.log(newRecipeFormValues);

      //by definition, values for Number inputs in HTML forms are still strings, so must convert them to numbers first.
      const {cookingTime, servings} = newRecipeFormValues;
      newRecipeFormValues.cookingTime = Number(cookingTime);
      newRecipeFormValues.servings = Number(servings);

      let newRecipeIdObject = await RemixApi.addNewRecipe(newRecipeFormValues);
      return {successful: true, newRecipeId: newRecipeIdObject.newRecipeId};
    } catch(errors) {
      console.error("Failed to add a new recipe", errors);
      return {successful: false, errors};
    }
  };

  /**
   * Is triggered by the user submitting the form to edit an existing recipe. Processes the form values, then calls the RemixAPI with
   * the processed form data, which sends a request to the backend to edit the recipe in the database.
   * If successful, will return an object containing the id of the updated recipe.
   */
  const editRecipe = async (recipeId, editRecipeFormValues) => {
    try {
      console.log(editRecipeFormValues);

      //by definition, values for Number inputs in HTML forms are still strings, so must convert them to numbers first.
      const {cookingTime, servings} = editRecipeFormValues;
      editRecipeFormValues.cookingTime = Number(cookingTime);
      editRecipeFormValues.servings = Number(servings);

      let editRecipeIdObject = await RemixApi.editRecipe(recipeId, editRecipeFormValues);
      return {successful: true, updatedRecipeId: editRecipeIdObject.updatedRecipeId};
    } catch(errors) {
      console.error(`Failed to update the recipe with id ${recipeId}`, errors);
      return {successful: false, errors};
    }
  };

  //When the page is first loaded, "Loading" will be displayed while the currently logged in user (if applicable)'s information is being fetched.
  if (!userInfoLoaded) return (
    <div className="App">
      <h1>Loading...</h1>
    </div>
  )

  return (
    <CurrentUserContext.Provider value={{currentUserInfo, setCurrentUserInfo, userToken, setUserToken}}>
      <div className="App">
        <RemixNavbar logOutFunc={logoutUser} />
        <RemixRoutes signUpFunc={signUpNewUser} loginFunc={loginUser} addRecipeFunc={addNewRecipe} editRecipeFunc={editRecipe}/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;