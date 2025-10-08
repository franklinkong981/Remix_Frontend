import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

import Alert from "../reusables/Alert.jsx";

/** Form to add a new recipe, used by logged in user. Users provide the name, a short description of the recipe, ingredients, directions,
 * and optional data such as estimated cooking time, servings, and a URL for the image to be displayed on the recipe details page.
 * 
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
    <div className="NewRecipeForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Create a New Recipe Below.</h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="NewRecipeForm-name-field">Name of recipe (1-100 characters)</label>
                <input
                    id="NewRecipeForm-name-field"
                    type="text"
                    name="name"
                    className="form-control"
                    value={newRecipeFormData.name}
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRecipeForm-description-field">Description (1-255 characters)</label>
                <input
                    id="NewRecipeForm-description-field"
                    type="text"
                    name="description"
                    className="form-control"
                    value={newRecipeFormData.description}
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRecipeForm-ingredients-field">Ingredients (required)</label>
                <input
                    id="NewRecipeForm-ingredients-field"
                    type="text"
                    name="ingredients"
                    className="form-control"
                    value={newRecipeFormData.ingredients}
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRecipeForm-directions-field">Directions (required)</label>
                <input
                    id="NewRecipeForm-directions-field"
                    type="text"
                    name="directions"
                    className="form-control"
                    value={newRecipeFormData.directions}
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRecipeForm-cooking-time-field">Estimated cooking time (leave 0 if blank) </label>
                <input
                    id="NewRecipeForm-cooking-time-field"
                    type="number"
                    min="0"
                    name="cookingTime"
                    className="form-control"
                    value={newRecipeFormData.cookingTime}
                    onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRecipeForm-servings-field">Servings (leave 0 if blank) </label>
                <input
                    id="NewRecipeForm-servings-field"
                    type="number"
                    min="0"
                    name="servings"
                    className="form-control"
                    value={newRecipeFormData.servings}
                    onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRecipeForm-imageurl-field">Image URL (optional) </label>
                <input
                    id="NewRecipeForm-imageurl-field"
                    type="text"
                    name="imageUrl"
                    className="form-control"
                    value={newRecipeFormData.imageUrl}
                    onChange={handleChange}
                />
              </div>

              {newRecipeFormErrors.length ? <Alert alertTexts={newRecipeFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Add Recipe
              </button>
            </form>
            <p>If the new recipe is successfully created, you'll be redirected to a page containing its details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewRecipeForm;