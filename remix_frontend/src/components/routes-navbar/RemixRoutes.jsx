import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Homepage from "../home/Homepage.jsx";
import LoginForm from "../auth/LoginForm.jsx";
import SignUpForm from "../auth/SignUpForm.jsx";
import UpdateProfileForm from "../profile/UpdateProfileForm.jsx";

/**
 * The component for site-wide routes rendered by the App component.
 * 
 * Parts of the site should only be visitable when logged in. Those routes
 * are wrapped by <ProtectedRoute>, which is an authorization component.
 * 
 * Visitng a non-existent route redirects to the homepage.
 */
function RemixRoutes({signUpFunc, loginFunc}) {
  return (
    <div className="Routes pt-5">
      <Routes>
        <Route exact path="/login" element={<LoginForm loginFunc={loginFunc} />} />
        <Route path="/signup" element={<SignUpForm signUpFunc={signUpFunc} />} />

        <Route path="/profile" element={<ProtectedRoute> 
          <UpdateProfileForm /> 
        </ProtectedRoute>} />

        <Route exact path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </div>
  );
}

export default RemixRoutes;