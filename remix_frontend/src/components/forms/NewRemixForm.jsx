import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

import Alert from "../reusables/Alert.jsx";

/** Form to add a new remix, used by logged in user. 
 * 
 * Top level component of the route /recipes/:recipeId/remixes/new.
 * 
 * This component shows the form and manages the update to form fields as user types in data.
 * The form will come preloaded with information about the original recipe, and the user will change the data in the inputs
 * to make the remix.
 * 
 * Upon submission:
 * - Communicates with the backend, which checks to see if each field submitted has a valid input.
 * - If one or more fields do not have valid inputs, return errors as Alert components. 
 * - Calls the RemixApi which communicates with backend to add the new remix to the database using the data submitted from the form.
 * - If successful, the new remix is successfully created in the database. 
 * - The user is then redirected to the details page of the remix that they have just created.
 */
function NewRemixForm({addRemixFunc}) {
  const navigate = useNavigate();
  const {recipeId} = useParams();

  //Initially, the form data will be blank. Only after the existing data of the current recipe is fetched from the backend
  // will the form load. The fields will be prefilled with the original recipe's existing information.
  const [addRemixFormData, setAddRemixFormData] = useState({});
  const [addRemixFormErrors, setAddRemixFormErrors] = useState([]);

  //retrieve detailed info about the original recipe.
  // While this is happening, the word "Loading" is displayed on the screen. The form won't be displayed 
  // until the detailed information of the original recipe is returned from the API.
  useEffect(function loadRecipeDetailsWhenMounted() {
    async function fetchRecipeDetails() {
      const originalRecipeInfo = await RemixApi.getRecipeDetails(recipeId);
      setAddRemixFormData({
        name: originalRecipeInfo.name,
        description: originalRecipeInfo.description,
        purpose: "",
        ingredients: originalRecipeInfo.ingredients,
        directions: originalRecipeInfo.directions,
        cookingTime: originalRecipeInfo.cookingTime,
        servings: originalRecipeInfo.servings,
        imageUrl: originalRecipeInfo.imageUrl
      });
    }
    fetchRecipeDetails();
  }, [recipeId]);

  /**
   * Handles form submission. Calls the function addRemixFunc prop, which should contain
   * a call to the RemixApi to process the form inputs and then send a request to the backend to validate the inputs
   * and attempt to add a new recipe to the database with the information contained in the inputs..
   * If successful, the new recipe is created in the database and the user will be taken to the new recipe's details page.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let addRemixResult = await addRecipeFunc(recipeId, addRemixFormData);
    if (addRemixResult.successful) {
      navigate(`/remixes/${addRemixResult.newRemixId}`);
    } else {
      setNewRemixFormErrors(addRemixResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setNewRemixFormData(newRemixFormData => ({...newRemixFormData, [name]: value}));
  }

  return (
    <div className="NewRemixForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Create a New Remix Below.</h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="NewRemixForm-name-field">Name of remix (1-100 characters)</label>
                <input
                    id="NewRemixForm-name-field"
                    type="text"
                    name="name"
                    className="form-control"
                    value={newRemixFormData.name}
                    minlength="1"
                    maxlength="100"
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRemixForm-description-field">Description (1-255 characters)</label>
                <textarea
                    id="NewRemixForm-description-field"
                    name="description"
                    className="form-control"
                    value={newRemixFormData.description}
                    rows="3"
                    cols="50"
                    minlength="1"
                    maxlength="255"
                    onChange={handleChange}
                    required
                ></textarea>
              </div>

              <p className="NewRemixForm-purpose-text">Please give a short blurb explaining the reasons for creating this remix.</p>

              <div className="form-group">
                <label htmlFor="NewRemixForm-purpose-field">Purpose of remix (10-255 characters)</label>
                <input
                    id="NewRemixForm-name-field"
                    type="text"
                    name="name"
                    className="form-control"
                    value={newRemixFormData.purpose}
                    minlength="10"
                    maxlength="255"
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRemixForm-ingredients-field">Ingredients (required)</label>
                <textarea
                    id="NewRemixForm-ingredients-field"
                    name="ingredients"
                    className="form-control"
                    value={newRemixFormData.ingredients}
                    rows="5"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please provide a comma-separated list of ingredients needed for your recipe."
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="NewRemixForm-directions-field">Directions (required)</label>
                <textarea
                    id="NewRemixForm-directions-field"
                    name="directions"
                    className="form-control"
                    value={newRemixFormData.directions}
                    rows="20"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please provide the directions in paragraph form."
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="NewRemixForm-cooking-time-field">Estimated cooking time (leave 0 if blank) </label>
                <input
                    id="NewRemixForm-cooking-time-field"
                    type="number"
                    min="0"
                    name="cookingTime"
                    className="form-control"
                    value={newRemixFormData.cookingTime}
                    onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRemixForm-servings-field">Servings (leave 0 if blank) </label>
                <input
                    id="NewRemixForm-servings-field"
                    type="number"
                    min="0"
                    name="servings"
                    className="form-control"
                    value={newRemixFormData.servings}
                    onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRemixForm-imageurl-field">Image URL (optional) </label>
                <input
                    id="NewRemixForm-imageurl-field"
                    type="text"
                    name="imageUrl"
                    className="form-control"
                    value={newRemixFormData.imageUrl}
                    onChange={handleChange}
                />
              </div>

              {newRemixFormErrors.length ? <Alert alertTexts={newRemixFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Add Remix
              </button>
            </form>
            <p>If the new remix is successfully created, you'll be redirected to a page containing its details.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewRemixForm;