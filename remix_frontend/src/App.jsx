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
 *                                recipeReview: {recipeId, recipeName, title, content, createdAt}, remixReivew: {remixId, remixName, title, content, createdAt}
 *                                favoriteRecipeIds: [id, ...], favoriteRemixIds: [id, ...] } 
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

  //list of recipe ids that make up the currently logged in user's favorite recipes.
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState(new Set([]));
  //list of remix ids that make up the currently logged in user's favorite remixes.
  const [favoriteRemixIds, setFavoriteRemixIds] = useState(new Set([]));

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
          setFavoriteRecipeIds(new Set(currentUser.favoriteRecipeIds));
          setFavoriteRemixIds(new Set(currentUser.favoriteRemixIds));
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

      let newRecipeObject = await RemixApi.addNewRecipe(newRecipeFormValues);

      if (currentUserInfo.recipes.length < 3) {
        setCurrentUserInfo(currentUserInfo => ({
          ...currentUserInfo,
          recipes: [newRecipeObject, ...currentUserInfo.recipes]
        }));
      } else {
        let currentRecipes = currentUserInfo.recipes;
        currentRecipes.pop();
        setCurrentUserInfo(currentUserInfo => ({
          ...currentUserInfo,
          recipes: [newRecipeObject, ...currentRecipes]
        }));
      }

      return {successful: true, newRecipeId: newRecipeObject.id};
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

      let updatedRecipeObject = await RemixApi.editRecipe(recipeId, editRecipeFormValues);

      return {successful: true, updatedRecipeId: updatedRecipeObject.id};
    } catch(errors) {
      console.error(`Failed to update the recipe with id ${recipeId}`, errors);
      return {successful: false, errors};
    }
  };

  /**
   * Is triggered by the user submitting the form to add a new remix. Processes the form values, adds in the original recipe id, 
   * then calls the RemixAPI with the processed form data, which sends a request to the backend to add the new remix to the database.
   * If successful, will return an object containing the id of the newly created remix that was added to the database.
   */
  const addNewRemix = async (originalRecipeId, newRemixFormValues) => {
    try {
      console.log(newRemixFormValues);

      //by definition, values for Number inputs in HTML forms are still strings, so must convert them to numbers first.
      const {cookingTime, servings} = newRemixFormValues;
      newRemixFormValues.cookingTime = Number(cookingTime);
      newRemixFormValues.servings = Number(servings);

      //add in the originalRecipeId to the newRemixFormValues, since that is required in the body.
      newRemixFormValues.originalRecipeId = Number(originalRecipeId);

      let newRemixObject = await RemixApi.addNewRemix(newRemixFormValues);
      return {successful: true, newRemixId: newRemixObject.id};
    } catch(errors) {
      console.error("Failed to add a new remix", errors);
      return {successful: false, errors};
    }
  };

  /**
   * Is triggered by the user submitting the form to edit an existing remix. Processes the form values, then calls the RemixAPI with
   * the processed form data, which sends a request to the backend to edit the remix in the database.
   * If successful, will return an object containing the id of the updated remix.
   */
  const editRemix = async (remixId, editRemixFormValues) => {
    try {
      console.log(editRemixFormValues);

      //by definition, values for Number inputs in HTML forms are still strings, so must convert them to numbers first.
      const {cookingTime, servings} = editRemixFormValues;
      editRemixFormValues.cookingTime = Number(cookingTime);
      editRemixFormValues.servings = Number(servings);

      let updatedRemixObject = await RemixApi.editRemix(remixId, editRemixFormValues);
      return {successful: true, updatedRemixId: updatedRemixObject.id};
    } catch(errors) {
      console.error(`Failed to update the recipe with id ${remixId}`, errors);
      return {successful: false, errors};
    }
  };

  /**
   * Is triggered by the user submitting the form to add a new recipe review. Processes the form values, then calls the RemixAPI with
   * the processed form data, which sends a request to the backend to add the new recipe review to the database.
   * If successful, will simply return an object with the successful attribute set to true.
   */
  const addNewRecipeReview = async (recipeId, newRecipeReviewFormValues) => {
    try {
      console.log(newRecipeReviewFormValues);

      await RemixApi.addNewRecipeReview(recipeId, newRecipeReviewFormValues);


      return {successful: true};
    } catch(errors) {
      console.error("Failed to add a new recipe review", errors);
      return {successful: false, errors};
    }
  };

  /**
   * Is triggered by the user submitting the form to edit an existing recipe review. Calls the RemixAPI with
   * the processed form data and the review id, which sends a request to the backend to update the recipe review to the database.
   * If successful, will simply return an object with the successful attribute set to true.
   */
  const editRecipeReview = async (reviewId, editRecipeReviewFormValues) => {
    try {
      console.log(editRecipeReviewFormValues);

      await RemixApi.editRecipeReview(reviewId, editRecipeReviewFormValues);
      return {successful: true};
    } catch(errors) {
      console.error(`Failed to update the recipe review with id of ${reviewId}`, errors);
      return {successful: false, errors};
    }
  };

  /**
   * Is triggered by the user submitting the form to add a new remix review. Processes the form values, then calls the RemixAPI with
   * the processed form data, which sends a request to the backend to add the new remix review to the database.
   * If successful, will simply return an object with the successful attribute set to true.
   */
  const addNewRemixReview = async (remixId, newRemixReviewFormValues) => {
    try {
      console.log(newRemixReviewFormValues);

      await RemixApi.addNewRemixReview(remixId, newRemixReviewFormValues);
      return {successful: true};
    } catch(errors) {
      console.error("Failed to add a new remix review", errors);
      return {successful: false, errors};
    }
  };

  /**
   * Is triggered by the user submitting the form to edit an existing remix review. Calls the RemixAPI with
   * the processed form data and the review id, which sends a request to the backend to update the remix review to the database.
   * If successful, will simply return an object with the successful attribute set to true.
   */
  const editRemixReview = async (reviewId, editRemixReviewFormValues) => {
    try {
      console.log(editRemixReviewFormValues);

      await RemixApi.editRemixReview(reviewId, editRemixReviewFormValues);
      return {successful: true};
    } catch(errors) {
      console.error(`Failed to update the recipe review with id of ${reviewId}`, errors);
      return {successful: false, errors};
    }
  };

  /**
  * Checks whether a recipe with a specific recipeId is currently in the logged in user's list of favorite recipes.
  */
  const isRecipeInFavorites = (recipeId) => {
    return favoriteRecipeIds.has(recipeId);
  };

  /**
   * Adds the recipe with id of recipeId to currently logged in user's list of favorite recipes in the backend,
   * updates the display in the frontend as well to match this addition.
   * If recipe id is already in the user's list of favorite recipes, do nothing.
   */
  const addRecipeToFavorites = async (recipeId) => {
    if (isRecipeInFavorites(recipeId)) return;

    await RemixApi.addRecipeToFavorites(recipeId);

    setFavoriteRecipeIds(new Set([...favoriteRecipeIds, recipeId]));
  };

  /**
   * Removes the recipe with id of recipeId from currently logged in user's list of favorite recipes in the backend,
   * updates the display in the frontend as well to match this deletion.
   * If recipe id is already not in the user's list of favorite recipes, do nothing.
   */
  const removeRecipeFromFavorites = async (recipeId) => {
    if (!(isRecipeInFavorites(recipeId))) return;

    await RemixApi.removeRecipeFromFavorites(recipeId);

    const newFavoriteRecipeIds = new Set(favoriteRecipeIds);
    newFavoriteRecipeIds.delete(recipeId);
    setFavoriteRecipeIds(newFavoriteRecipeIds);
  };

  /**
  * Checks whether a remix with a specific remixId is currently in the logged in user's list of favorite remixes.
  */
  const isRemixInFavorites = (remixId) => {
    return favoriteRemixIds.has(remixId);
  };

  /**
   * Adds the remix with id of remixId to currently logged in user's list of favorite remixes in the backend,
   * updates the display in the frontend as well to match this addition.
   * If remix id is already in the user's list of favorite remixes, do nothing.
   */
  const addRemixToFavorites = async (remixId) => {
    if (isRemixInFavorites(remixId)) return;

    await RemixApi.addRemixToFavorites(remixId);

    setFavoriteRemixIds(new Set([...favoriteRemixIds, remixId]));
  };

  /**
   * Removes the remix with id of remixId from currently logged in user's list of favorite remixes in the backend,
   * updates the display in the frontend as well to match this deletion.
   * If remix id is already not in the user's list of favorite remixes, do nothing.
   */
  const removeRemixFromFavorites = async (remixId) => {
    if (!(isRemixInFavorites(remixId))) return;

    await RemixApi.removeRemixFromFavorites(remixId);

    const newFavoriteRemixIds = new Set(favoriteRemixIds);
    newFavoriteRemixIds.delete(remixId);
    setFavoriteRemixIds(newFavoriteRemixIds);
  };

  //When the page is first loaded, "Loading" will be displayed while the currently logged in user (if applicable)'s information is being fetched.
  if (!userInfoLoaded) return (
    <div className="App">
      <h1>Loading...</h1>
    </div>
  )

  return (
    <CurrentUserContext.Provider value={{ currentUserInfo, setCurrentUserInfo, userToken, setUserToken, 
    isRecipeInFavorites, addRecipeToFavorites, removeRecipeFromFavorites, isRemixInFavorites, addRemixToFavorites, removeRemixFromFavorites }}>
      <div className="App">
        <RemixNavbar logOutFunc={logoutUser} />
        <RemixRoutes signUpFunc={signUpNewUser} loginFunc={loginUser} addRecipeFunc={addNewRecipe} editRecipeFunc={editRecipe}
                     addRemixFunc={addNewRemix} editRemixFunc={editRemix} addRecipeReviewFunc={addNewRecipeReview}
                     editRecipeReviewFunc={editRecipeReview} addRemixReviewFunc={addNewRemixReview} editRemixReviewFunc={editRemixReview}/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;