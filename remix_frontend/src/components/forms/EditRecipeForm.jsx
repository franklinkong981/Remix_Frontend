import React, {useState} from "react";
import {useNavigate, useParams, Link} from "react-router-dom";

import Alert from "../reusables/Alert.jsx";

/** Form to edit an existing recipe that was created by the logged in user. 
 * 
 * Top level component of the route /recipes/:recipeId/edit.
 * 
 * This component shows the edit recipe form and manages the update to form fields as user types in data.
 * 
 * Upon submission:
 * - Communicates the backend, which checks to see if each field submitted has a valid input.
 * - If one or more fields do not have valid inputs, return errors as Alert components. 
 * - Calls the RemixApi which communicates with backend to update the recipe in the database using the data submitted from the form.
 * - If successful, the recipe is successfully updated in the database. 
 * - The user is then redirected to the details page of the recipe that they have just updated.
 */
function EditRecipeForm({editRecipeFunc}) {
  const navigate = useNavigate();
  const {recipeId} = useParams();

  //Initially, the form data will be blank. Only after the existing data of the current recipe is fetched from the backend
  // will the form load. The fields will be prefilled with the recipe's existing information.
  const [editRecipeFormData, setEditRecipeFormData] = useState({});
  const [editRecipeFormErrors, setEditRecipeFormErrors] = useState([]);

  //retrieve detailed info about the current version of the recipe.
  // While this is happening, the word "Loading" is displayed on the screen. The form won't be displayed 
  // until the detailed information of the recipe is returned from the API.
  useEffect(function loadRecipeDetailsWhenMounted() {
    async function fetchRecipeDetails() {
      const currentRecipeInfo = await RemixApi.getRecipeDetails(recipeId);
      setEditRecipeFormData({
        name: currentRecipeInfo.name,
        description: currentRecipeInfo.description,
        ingredients: currentRecipeInfo.ingredients,
        directions: currentRecipeInfo.directions,
        cookingTime: currentRecipeInfo.cookingTime,
        servings: currentRecipeInfo.servings,
        imageUrl: currentRecipeInfo.imageUrl
      });
    }
    fetchRecipeDetails();
  }, [recipeId]);

  /**
   * Handles form submission. Calls the function editRecipeFunc prop, which should contain
   * a call to the RemixApi to process the form inputs and then send a request to the backend to validate the inputs
   * and attempt to edit the recipe in the database with the information provided.
   * If successful, the recipe is updated in the database and the user will be taken to the updated recipe's details page.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let editRecipeResult = await editRecipeFunc(recipeId, editRecipeFormData);
    if (editRecipeResult.successful) {
      navigate(`/recipes/${editRecipeResult.updatedRecipeId}`);
    } else {
      setEditRecipeFormErrors(editRecipeResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setEditRecipeFormData(editRecipeFormData => ({...editRecipeFormData, [name]: value}));
  }

  if (!editRecipeFormData) return <h1>Loading...</h1>

  return (
    <div className="EditRecipeForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Update the Recipe <Link className="EditRecipeForm-recipe-details-link" to={`/recipes/${recipeId}`}>
            {editRecipeFormData.name}
          </Link>
        </h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="EditRecipeForm-name-field">Name of recipe (1-100 characters)</label>
                <input
                    id="EditRecipeForm-name-field"
                    type="text"
                    name="name"
                    className="form-control"
                    value={editRecipeFormData.name}
                    minlength="1"
                    maxlength="100"
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="EditRecipeForm-description-field">Description (1-255 characters)</label>
                <textarea
                    id="EditRecipeForm-description-field"
                    name="description"
                    className="form-control"
                    value={editRecipeFormData.description}
                    rows="3"
                    cols="50"
                    minlength="1"
                    maxlength="255"
                    onChange={handleChange}
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="EditRecipeForm-ingredients-field">Ingredients (required)</label>
                <textarea
                    id="EditRecipeForm-ingredients-field"
                    name="ingredients"
                    className="form-control"
                    value={editRecipeFormData.ingredients}
                    rows="5"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please provide a comma-separated list of ingredients needed for your recipe."
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="EditRecipeForm-directions-field">Directions (required)</label>
                <textarea
                    id="EditRecipeForm-directions-field"
                    name="directions"
                    className="form-control"
                    value={editRecipeFormData.directions}
                    rows="20"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please provide the directions in paragraph form."
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="EditRecipeForm-cooking-time-field">Estimated cooking time (leave 0 if blank) </label>
                <input
                    id="EditRecipeForm-cooking-time-field"
                    type="number"
                    min="0"
                    name="cookingTime"
                    className="form-control"
                    value={editRecipeFormData.cookingTime}
                    onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="EditRecipeForm-servings-field">Servings (leave 0 if blank) </label>
                <input
                    id="EditRecipeForm-servings-field"
                    type="number"
                    min="0"
                    name="servings"
                    className="form-control"
                    value={editRecipeFormData.servings}
                    onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="EditRecipeForm-imageurl-field">Image URL (optional) </label>
                <input
                    id="EditRecipeForm-imageurl-field"
                    type="text"
                    name="imageUrl"
                    className="form-control"
                    value={editRecipeFormData.imageUrl}
                    onChange={handleChange}
                />
              </div>

              {editRecipeFormErrors.length ? <Alert alertTexts={editRecipeFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Update Recipe
              </button>
            </form>
            <p>If the recipe is successfully updated, you'll be redirected to its details page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRecipeForm;