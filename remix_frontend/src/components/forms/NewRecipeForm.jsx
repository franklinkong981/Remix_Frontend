import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

import Alert from "../reusables/Alert.jsx";

/** Form to add a new recipe, used by logged in user. Users provide the name, a short description of the recipe, ingredients, directions,
 * and optional data such as estimated cooking time, servings, and a URL for the image to be displayed on the recipe details page.
 * Top level component of the route /recipes/new.
 * 
 * This component shows the form and manages the update to form fields as user types in data.
 * 
 * Upon submission:
 * - Communicates the backend, which checks to see if each field submitted has a valid input.
 * - If one or more fields do not have valid inputs, return errors as Alert components. 
 * - Calls the RemixApi which communicates with backend to add a new recipe to the database using the data submitted from the form.
 * - If successful, the new recipe is successfully created in the database. 
 * - The user is then redirected to the details page of the recipe that they have just created.
 */
function NewRecipeForm({addRecipeFunc}) {
  const navigate = useNavigate();

  const [newRecipeFormData, setNewRecipeFormData] = useState({
    name: "",
    description: "",
    ingredients: "",
    directions: "",
    cookingTime: 0,
    servings: 0,
    imageUrl: ""
  });
  const [NewRecipeFormErrors, setNewRecipeFormErrors] = useState([]);

  /**
   * Handles form submission. Calls the function addRecipeFunc prop, which should contain
   * a call to the RemixApi to process the form inputs and then send a request to the backend to validate the inputs
   * and attempt to add a new recipe to the database with the information contained in the inputs..
   * If successful, the new recipe is created in the database and the user will be taken to the new recipe's details page.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let addRecipeResult = await addRecipeFunc(newRecipeFormData);
    if (addRecipeResult.successful) {
      navigate(`/recipes/${addRecipeResult.newRecipeId}`);
    } else {
      setNewRecipeFormErrors(addRecipeResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setNewRecipeFormData(newRecipeFormData => ({...newRecipeFormData, [name]: value}));
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

export default NewRecipeForm;