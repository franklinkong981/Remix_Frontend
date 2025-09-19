import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

import Alert from "../reusables/Alert.jsx";

/** Signup form. Users can sign up by creating a username, email, and password.
 * Top level component of the route /signup.
 * 
 * This component shows the form and manages the update to form fields as state changes.
 * 
 * Upon submission:
 * - Calls the RemixApi which communicates with backend to create a new account for the user in the database.
 * - If failed, return errors as Alert components. 
 * - If successful, the new user account is successfully created in the database. 
 *   The user is then redirected to the login page to log in with their new account username and password they just created.
 */
function SignUpForm({signUpFunc}) {
  const navigate = useNavigate();

  const [signUpFormData, setSignUpFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [signUpFormErrors, setSignUpFormErrors] = useState([]);

  /**
   * Handles form submission. Calls the signUpFunc prop, which should contain
   * a call to the RemixApi to create a new account for the user in the backend database.
   * If successful, redirects to login form.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let signUpResult = await signUpFunc(signUpFormData);
    if (signUpResult.signUpSuccessful) {
      navigate("/login");
    } else {
      setSignUpFormErrors(signUpResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setSignUpFormData(signUpFormData => ({...signUpFormData, [name]: value}));
  }

  return (
    <div className="SignupForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">To Get Started, Please Create an Account Below</h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="SignUpForm-username-field">Choose a username (5-30 characters)</label>
                <input
                    id="SignUpForm-username-field"
                    type="text"
                    name="username"
                    className="form-control"
                    value={signUpFormData.username}
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label>Email (must be a valid email)</label>
                <input
                    id="SignUpForm-email-field"
                    type="email"
                    name="email"
                    className="form-control"
                    value={signUpFormData.email}
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="SignUpForm-password-field">Choose a password (at least 8 characters long)</label>
                <input
                    id="SignUpForm-password-field"
                    type="password"
                    name="password"
                    className="form-control"
                    value={signUpFormData.password}
                    onChange={handleChange}
                    required
                />
              </div>

              {signUpFormErrors.length ? <Alert alertTexts={signUpFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Create Account
              </button>
            </form>
            <p>If your account creation is successful, you'll be redirected to the login page to sign in with your new username and password.</p>
            <p>Already have an account? <Link to="/login">Log in now!</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;