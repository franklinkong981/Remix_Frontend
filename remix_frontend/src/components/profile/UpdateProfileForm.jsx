import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";

import RemixApi from "../../api/api.js";

import Alert from "../reusables/Alert.jsx";

import CurrentUserContext from "../../contexts/currentUserContext.jsx";

/**
 * Profile editing form that logged in user can fill out to update their profile information.
 * Top-level component of /profile route.
 * 
 * Handles changes to local form state on the frontend. Submitting form calls RemixApi to save
 * updated user information on the backend and also the frontend through currentUserInfo state object in CurrentUserContext,
 * which triggers reloading throughout the site to updated user information.
 * 
 * Alert messages will be displayed if user inputs don't match expected criteria, confirmation of a successful save is a simple Alert component.
 */
function UpdateProfileForm() {
  const {currentUserInfo, setCurrentUserInfo, userToken, setUserToken} = useContext(CurrentUserContext);

  const [profileFormData, setProfileFormData] = useState({
    username: currentUserInfo.username,
    email: currentUserInfo.email
  });
  const [profileFormErrors, setProfileFormErrors] = useState([]);

  const [updateProfileSuccessful, setUpdateProfileSuccessful] = useState(false);

  function handleChange(evt) {
    const {name, value} = evt.target;
    setProfileFormData(profileFormData => ({
      ...profileFormData,
      [name]: value
    }));
  }

  /**
   * On form submission,
   * - First attempt to update user information on backend and report any errors.
   * - Upon successful update, clears any error messages on form, shows save-confirmed message.
   * - Finally, updates current user info on frontend through CurrentUserContext and reloads current user info throughout the site.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();

    let updateProfileFormValues = {
      username: profileFormData.username,
      email: profileFormData.email
    };

    let username = currentUserInfo.username;
    let updatedUserInfo;
    console.log(`The old token is ${userToken}`);

    try {
      updatedUserInfo = await RemixApi.updateUserProfile(username, updateProfileFormValues);
    } catch(errors) {
      setUpdateProfileSuccessful(false);
      setProfileFormErrors(errors);
      return;
    }

    setProfileFormErrors([]);
    setUpdateProfileSuccessful(true);
    console.log(`The new token is ${updatedUserInfo.updatedToken}`);
    

    // The RemixApi method updateUserProfile updates the user information (new username and email) in the backend database,
    // then returns an updated token string containing the new payload that includes the updated username and email.
    // Setting the user token to this new string updates currentUserInfo as well and triggers a re-render, so that the entire site
    // is updated with this new user information.
    setUserToken(updatedUserInfo.updatedToken);
  }

  return (
    <div className="UpdateProfileForm col-md-6 col-lg-4 offset-md-3 offset-lg-4">
      <h2 className="UpdateProfileForm-title">Your current profile information is displayed below.</h2>
      <h4 className="UpdateProfileForm-instructions">If you would like to edit this information, fill in the new username/email and submit the form.</h4>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="UpdateProfileForm-username-field">New Username (must be 5-30 characters): </label>
              <input id="UpdateProfileForm-username-field"
                className="form-control"
                type="text"
                name="username"
                value={profileFormData.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="UpdateProfileForm-email-field">New Email (must be a valid email):</label>
              <input id="UpdateProfileForm-email-field"
                className="form-control"
                type="email"
                name="email"
                value={profileFormData.email}
                onChange={handleChange}
              />
            </div>

            {profileFormErrors.length ? <Alert alertTexts={profileFormErrors} /> : null}

            {updateProfileSuccessful ? <Alert alertType="success" alertTexts={["Profile updated successfully!"]} /> : null}

            <button 
              className="UpdateProfileForm-button btn btn-primary btn-block mt-4" 
              onClick={handleSubmit}
            >Save Updated Info</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfileForm;