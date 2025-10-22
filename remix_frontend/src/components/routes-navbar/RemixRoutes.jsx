import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Homepage from "../home/Homepage.jsx";
import LoginForm from "../auth/LoginForm.jsx";
import SignUpForm from "../auth/SignUpForm.jsx";

import UserRecipeList from "../profile/UserRecipeList.jsx";
import UserRemixList from "../profile/UserRemixList.jsx";
import UserRecipeReviewList from "../profile/UserRecipeReviewList.jsx";
import UserRemixReviewList from "../profile/UserRemixReviewList.jsx";
import UserFavoriteRecipesList from "../profile/UserFavoriteRecipesList.jsx";
import UserFavoriteRemixesList from "../profile/UserFavoriteRemixesList.jsx";

import UpdateProfileForm from "../profile/UpdateProfileForm.jsx";

import RecipeListWithSearchBar from "../recipes/RecipeListWithSearchBar.jsx";
import RecipeDetail from "../recipes/RecipeDetail.jsx";
import FullRecipeRemixList from "../recipes/FullRecipeRemixList.jsx";
import FullRecipeReviewList from "../recipes/FullRecipeReviewList.jsx";

import RemixDetail from "../remixes/RemixDetail.jsx";
import FullRemixReviewList from "../remixes/FullRemixReviewList.jsx";

import NewRecipeForm from "../forms/NewRecipeForm.jsx";
import EditRecipeForm from "../forms/EditRecipeForm.jsx";
import NewRemixForm from "../forms/NewRemixForm.jsx";
import EditRemixForm from "../forms/EditRemixForm.jsx";

import NewRecipeReviewForm from "../forms/NewRecipeReviewForm.jsx";
import EditRecipeReviewForm from "../forms/EditRecipeReviewForm.jsx";
import NewRemixReviewForm from "../forms/NewRemixReviewForm.jsx";
import EditRemixReviewForm from "../forms/EditRemixReviewForm.jsx";

/**
 * The component for site-wide routes rendered by the App component.
 * 
 * Parts of the site should only be visitable when logged in. Those routes
 * are wrapped by <ProtectedRoute>, which is an authorization component.
 * 
 * Visitng a non-existent route redirects to the homepage.
 */
function RemixRoutes({signUpFunc, loginFunc, addRecipeFunc, editRecipeFunc, addRemixFunc, editRemixFunc, addRecipeReviewFunc, editRecipeReviewFunc, addRemixReviewFunc, editRemixReviewFunc}) {
  return (
    <div className="Routes pt-5">
      <Routes>
        <Route exact path="/login" element={<LoginForm loginFunc={loginFunc} />} />
        <Route path="/signup" element={<SignUpForm signUpFunc={signUpFunc} />} />

        <Route path="/users/:username/recipes" element={<ProtectedRoute> 
          <UserRecipeList /> 
        </ProtectedRoute>} />
        <Route path="/users/:username/reviews/recipes" element={<ProtectedRoute> 
          <UserRecipeReviewList /> 
        </ProtectedRoute>} />
        <Route path="/users/:username/remixes" element={<ProtectedRoute> 
          <UserRemixList /> 
        </ProtectedRoute>} />
        <Route path="/users/:username/reviews/remixes" element={<ProtectedRoute> 
          <UserRemixReviewList /> 
        </ProtectedRoute>} />
        <Route path="/users/:username/favorites/recipes" element={<ProtectedRoute> 
          <UserFavoriteRecipesList /> 
        </ProtectedRoute>} />
        <Route path="/users/:username/favorites/remixes" element={<ProtectedRoute> 
          <UserFavoriteRemixesList /> 
        </ProtectedRoute>} />

        
        <Route path="/profile" element={<ProtectedRoute> 
          <UpdateProfileForm /> 
        </ProtectedRoute>} />

        <Route path="/recipes" element={<ProtectedRoute>
          <RecipeListWithSearchBar />
        </ProtectedRoute>} />
        <Route path="/recipes/:recipeId" element={<ProtectedRoute>
          <RecipeDetail />
        </ProtectedRoute>} />
        <Route path="/recipes/:recipeId/reviews" element={<ProtectedRoute>
          <FullRecipeReviewList />
        </ProtectedRoute>} />
        <Route path="/recipes/:recipeId/remixes" element={<ProtectedRoute>
          <FullRecipeRemixList />
        </ProtectedRoute>} />

        <Route path="/remixes/:remixId" element={<ProtectedRoute>
          <RemixDetail />
        </ProtectedRoute>} />
        <Route path="/remixes/:remixId/reviews" element={<ProtectedRoute>
          <FullRemixReviewList />
        </ProtectedRoute>} />

        <Route path="/recipes/new" element={<ProtectedRoute>
          <NewRecipeForm addRecipeFunc={addRecipeFunc} />
        </ProtectedRoute>} />
        <Route path="/recipes/:recipeId/edit" element={<ProtectedRoute>
          <EditRecipeForm editRecipeFunc={editRecipeFunc} />
        </ProtectedRoute>} />
        <Route path="/recipes/:recipeId/remixes/new" element={<ProtectedRoute>
          <NewRemixForm addRemixFunc={addRemixFunc} />
        </ProtectedRoute>} />
        <Route path="/remixes/:remixId/edit" element={<ProtectedRoute>
          <EditRemixForm editRemixFunc={editRemixFunc} />
        </ProtectedRoute>} />

        <Route path="/recipes/:recipeId/reviews/new" element={<ProtectedRoute>
          <NewRecipeReviewForm addRecipeReviewFunc={addRecipeReviewFunc} />
        </ProtectedRoute>} />
        <Route path="/recipes/reviews/:reviewId/edit" element={<ProtectedRoute>
          <EditRecipeReviewForm editRecipeReviewFunc={editRecipeReviewFunc} />
        </ProtectedRoute>} />
        <Route path="/remixes/:remixId/reviews/new" element={<ProtectedRoute>
          <NewRemixReviewForm addRemixReviewFunc={addRemixReviewFunc} />
        </ProtectedRoute>} />
        <Route path="/remixes/reviews/:reviewId/edit" element={<ProtectedRoute>
          <EditRemixReviewForm editRemixReviewFunc={editRemixReviewFunc} />
        </ProtectedRoute>} />

        <Route exact path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </div>
  );
}

export default RemixRoutes;