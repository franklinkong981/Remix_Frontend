import React, {useState, useEffect} from "react";
import {useNavigate, useParams, useLocation, Link} from "react-router-dom";

import RemixApi from "../../api/api.js";

import Alert from "../reusables/Alert.jsx";

/** Form to add a edit an existing recipe review. Users can edit the title and content of the review.
 * 
 * Top level component of the route /recipes/reviews/:reviewId/edit.
 * 
 * This component first loads the existing title and content of the review into the form fields, and the user
 * edits the values in the inputs to create the updated review.
 * 
 * Upon submission:
 * - Communicates with the backend, which checks to see if each field submitted has a valid input.
 * - If one or more fields do not have valid inputs, return errors as Alert components. 
 * - Calls the RemixApi which communicates with backend to update the recipe review.
 * - If successful, the recipe review is successfully updated in the database. 
 * - The user is then redirected to the page showing all reviews of the recipe.
 */
function EditRecipeReviewForm({editRecipeReviewFunc}) {
  const navigate = useNavigate();
  const {reviewId} = useParams();
  const location = useLocation();
  //locationRecipe = state passed in from the /recipes/:recipeId aka recipe details page route, contains {recipeId, recipeName}
  const {recipeId, recipeName} = location.state;

  const [editRecipeReviewFormData, setEditRecipeReviewFormData] = useState({});
  const [editRecipeReviewFormErrors, setEditRecipeReviewFormErrors] = useState([]);

  //retrieve info about the current version of the recipe review.
  // While this is happening, the word "Loading" is displayed on the screen. The form won't be displayed 
  // until the existing information of the recipe review is returned from the API.
  useEffect(function loadRecipeReviewWhenMounted() {
    async function fetchRecipeReview() {
      const currentRecipeReview = await RemixApi.getRecipeReview(reviewId);
      setEditRecipeReviewFormData({
        title: currentRecipeReview.title,
        content: currentRecipeReview.content
      });
    }
    fetchRecipeReview();
  }, [reviewId]);

  /**
   * Handles form submission. Calls the function editRecipeReviewFunc prop, which should contain
   * a call to the RemixApi to process the form inputs and then send a request to the backend to validate the inputs
   * and attempt to update the recipe review in the database with the information contained in the inputs.
   * If successful, the recipe  review is updated in the database and the user will be taken to
   * the recipe's full recipe reviews page.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let editRecipeReviewResult = await editRecipeReviewFunc(reviewId, editRecipeReviewFormData);
    if (editRecipeReviewResult.successful) {
      navigate(`/recipes/${recipeId}/reviews`, {state: {recipeName}});
    } else {
      setEditRecipeReviewFormErrors(editRecipeReviewResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setEditRecipeReviewFormData(editRecipeReviewFormData => ({...editRecipeReviewFormData, [name]: value}));
  }

  if (!(Object.keys(editRecipeReviewFormData).length)) return <h1>Loading...</h1>

  return (
    <div className="EditRecipeReviewForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Edit Review for the Recipe <Link className="EditRecipeReviewForm-recipe-details-link" to={`/recipes/${recipeId}`}>
            {recipeName}
          </Link>
        </h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="EditRecipeReviewForm-name-field">Review title (1-100 characters) </label>
                <input
                    id="EditRecipeReviewForm-title-field"
                    type="text"
                    name="title"
                    className="form-control"
                    value={editRecipeReviewFormData.title}
                    minlength="1"
                    maxlength="100"
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="EditRecipeReviewForm-content-field">Content </label>
                <textarea
                    id="EditRecipeReviewForm-content-field"
                    name="content"
                    className="form-control"
                    value={editRecipeReviewFormData.content}
                    rows="3"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please type our your review here"
                    required
                ></textarea>
              </div>

              {editRecipeReviewFormErrors.length ? <Alert alertTexts={editRecipeReviewFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Update Review
              </button>
            </form>
            <p>If the review is successfully updated, you'll be redirected to the recipe's reviews page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRecipeReviewForm;