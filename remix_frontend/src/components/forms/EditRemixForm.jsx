import React, {useState, useEffect} from "react";
import {useNavigate, useParams, useLocation, Link} from "react-router-dom";

import RemixApi from "../../api/api.js";

import Alert from "../reusables/Alert.jsx";

/** Form to update an existing remix, used by logged in user. The remix must have been created by the logged in user.
 * 
 * Top level component of the route /remixes/:remixId/edit.
 * 
 * This component shows the form and manages the update to form fields as user types in data.
 * The form will come preloaded with information about the remix, and the user will change the data in the inputs
 * to update the remix.
 * 
 * Upon submission:
 * - Communicates with the backend, which checks to see if each field submitted has a valid input.
 * - If one or more fields do not have valid inputs, return errors as Alert components. 
 * - Calls the RemixApi which communicates with backend to update the remix in the database using the data submitted from the form.
 * - If successful, the remix is successfully updated in the database. 
 * - The user is then redirected to the details page of the remix that they have just updated.
 */
function EditRemixForm({editRemixFunc}) {
  const navigate = useNavigate();
  const {remixId} = useParams();
  const location = useLocation();
  //locationRemix = state passed in from the /remixes/:remixId aka remix details page route, contains {name}
  const locationRemix = location.state;

  //Initially, the form data will be blank. Only after the existing data of the current remix is fetched from the backend
  // will the form load. The fields will be prefilled with the remix's existing information.
  const [editRemixFormData, setEditRemixFormData] = useState({});
  const [editRemixFormErrors, setEditRemixFormErrors] = useState([]);

  //retrieve detailed info about the remix.
  // While this is happening, the word "Loading" is displayed on the screen. The form won't be displayed 
  // until the detailed information of the remix is returned from the API.
  useEffect(function loadRemixDetailsWhenMounted() {
    async function fetchRemixDetails() {
      const remixInfo = await RemixApi.getRemixDetails(remixId);
      setEditRemixFormData({
        name: remixInfo.name,
        description: remixInfo.description,
        purpose: remixInfo.purpose,
        ingredients: remixInfo.ingredients,
        directions: remixInfo.directions,
        cookingTime: remixInfo.cookingTime,
        servings: remixInfo.servings,
        imageUrl: remixInfo.imageUrl
      });
    }
    fetchRemixDetails();
  }, [remixId]);

  /**
   * Handles form submission. Calls the function editRemixFunc prop, which should contain
   * a call to the RemixApi to process the form inputs and then send a request to the backend to validate the inputs
   * and attempt to edit the remix in the database with the information contained in the inputs.
   * If successful, the remix is updated in the database and the user will be taken to the remix's details page.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let editRemixResult = await editRemixFunc(remixId, editRemixFormData);
    if (editRemixResult.successful) {
      navigate(`/remixes/${editRemixResult.updatedRemixId}`);
    } else {
      setNewRemixFormErrors(editRemixResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setEditRemixFormData(editRemixFormData => ({...editRemixFormData, [name]: value}));
  }

  if (!(Object.keys(editRemixFormData).length)) return <h1>Loading...</h1>

  return (
    <div className="EditRemixForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Update the Remix <Link className="EditRemixForm-remix-details-link" to={`/remixes/${remixId}`}>
            {locationRemix.name}
          </Link>
        </h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="EditRemixForm-name-field">Name of remix (1-100 characters)</label>
                <input
                    id="EditRemixForm-name-field"
                    type="text"
                    name="name"
                    className="form-control"
                    value={editRemixFormData.name}
                    minlength="1"
                    maxlength="100"
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="EditRemixForm-description-field">Description (1-255 characters)</label>
                <textarea
                    id="EditRemixForm-description-field"
                    name="description"
                    className="form-control"
                    value={editRemixFormData.description}
                    rows="3"
                    cols="50"
                    minlength="1"
                    maxlength="255"
                    onChange={handleChange}
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="EditRemixForm-purpose-field">Purpose (10-255 characters)</label>
                <textarea
                    id="EditRemixForm-purpose-field"
                    name="purpose"
                    className="form-control"
                    value={editRemixFormData.purpose}
                    rows="5"
                    cols="50"
                    minlength="10"
                    maxlength="255"  
                    onChange={handleChange}
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="EditRemixForm-ingredients-field">Ingredients (required)</label>
                <textarea
                    id="EditRemixForm-ingredients-field"
                    name="ingredients"
                    className="form-control"
                    value={editRemixFormData.ingredients}
                    rows="5"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please provide a comma-separated list of ingredients needed for your recipe."
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="EditRemixForm-directions-field">Directions (required)</label>
                <textarea
                    id="EditRemixForm-directions-field"
                    name="directions"
                    className="form-control"
                    value={editRemixFormData.directions}
                    rows="20"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please provide the directions in paragraph form."
                    required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="EditRemixForm-cooking-time-field">Estimated cooking time (leave 0 if blank) </label>
                <input
                    id="EditRemixForm-cooking-time-field"
                    type="number"
                    min="0"
                    name="cookingTime"
                    className="form-control"
                    value={editRemixFormData.cookingTime}
                    onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="EditRemixForm-servings-field">Servings (leave 0 if blank) </label>
                <input
                    id="EditRemixForm-servings-field"
                    type="number"
                    min="0"
                    name="servings"
                    className="form-control"
                    value={editRemixFormData.servings}
                    onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="EditRemixForm-imageurl-field">Image URL (optional) </label>
                <input
                    id="EditRemixForm-imageurl-field"
                    type="text"
                    name="imageUrl"
                    className="form-control"
                    value={editRemixFormData.imageUrl}
                    onChange={handleChange}
                />
              </div>

              {editRemixFormErrors.length ? <Alert alertTexts={editRemixFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Update Remix
              </button>
            </form>
            <p>If the new remix is successfully updated, you'll be redirected to its updated details page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRemixForm;