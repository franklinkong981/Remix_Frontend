import React, {useState} from "react";
import {useNavigate, useParams, useLocation, Link} from "react-router-dom";

import Alert from "../reusables/Alert.jsx";

/** Form to add a new recipe review, used by logged in user. Users provide the title and content of the review.
 * 
 * Top level component of the route /recipes/:recipeId/reviews/new.
 * 
 * This component shows the form and manages the update to form fields as user types in data.
 * 
 * Upon submission:
 * - Communicates with the backend, which checks to see if each field submitted has a valid input.
 * - If one or more fields do not have valid inputs, return errors as Alert components. 
 * - Calls the RemixApi which communicates with backend to add a new recipe review to the database using the data submitted from the form.
 * - If successful, the new recipe review is successfully created in the database. 
 * - The user is then redirected to the page showing all reviews of the recipe.
 */
function NewRecipeReviewForm({addRecipeReviewFunc}) {
  const navigate = useNavigate();
  const {recipeId} = useParams();
  const location = useLocation();
  //locationRecipe = state passed in from the /recipes/:recipeId aka recipe details page route, contains {recipeName}
  const locationRecipe = location.state;

  const [newRecipeReviewFormData, setNewRecipeReviewFormData] = useState({
    title: "",
    content: ""
  });
  const [newRecipeReviewFormErrors, setNewRecipeReviewFormErrors] = useState([]);

  /**
   * Handles form submission. Calls the function addRecipeReviewFunc prop, which should contain
   * a call to the RemixApi to process the form inputs and then send a request to the backend to validate the inputs
   * and attempt to add a new recipe review to the database with the information contained in the inputs.
   * If successful, the new recipe  review is created in the database and the user will be taken to
   * the recipe's full recipe reviews page, where the review they just created will be listed at the top.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let addRecipeReviewResult = await addRecipeReviewFunc(newRecipeReviewFormData);
    if (addRecipeReviewResult.successful) {
      navigate({
        pathname: `/recipes/${recipeId}/reviews/new`,
        state: {recipeName: locationRecipe.recipeName}
      });
    } else {
      setNewRecipeReviewFormErrors(addRecipeReviewResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setNewRecipeReviewFormData(newRecipeReviewFormData => ({...newRecipeReviewFormData, [name]: value}));
  }

  return (
    <div className="NewRecipeReviewForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Add a New Review for the Recipe <Link className="NewRecipeReviewForm-recipe-details-link" to={`/recipes/${recipeId}`}>
            {locationRecipe.recipeName}
          </Link>
        </h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="NewRecipeReviewForm-name-field">Review title (1-100 characters) </label>
                <input
                    id="NewRecipeReviewForm-title-field"
                    type="text"
                    name="title"
                    className="form-control"
                    value={newRecipeReviewFormData.title}
                    minlength="1"
                    maxlength="100"
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRecipeReviewForm-content-field">Content </label>
                <textarea
                    id="NewRecipeReviewForm-content-field"
                    name="content"
                    className="form-control"
                    value={newRecipeReviewFormData.content}
                    rows="3"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please type our your review here"
                    required
                ></textarea>
              </div>

              {newRecipeReviewFormErrors.length ? <Alert alertTexts={newRecipeReviewFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Add Review
              </button>
            </form>
            <p>If the new review is successfully created, you'll be redirected to the recipe's reviews page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewRecipeReviewForm;