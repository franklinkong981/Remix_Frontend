import React, {useState, useEffect} from "react";
import {useNavigate, useParams, useLocation, Link} from "react-router-dom";

import RemixApi from "../../api/api.js";

import Alert from "../reusables/Alert.jsx";

/** Form to add a edit an existing remix review. Users can edit the title and content of the review.
 * 
 * Top level component of the route /remixes/reviews/:reviewId/edit.
 * 
 * This component first loads the existing title and content of the review into the form fields, and the user
 * edits the values in the inputs to create the updated review.
 * 
 * Upon submission:
 * - Communicates with the backend, which checks to see if each field submitted has a valid input.
 * - If one or more fields do not have valid inputs, return errors as Alert components. 
 * - Calls the RemixApi which communicates with backend to update the remix review.
 * - If successful, the remix review is successfully updated in the database. 
 * - The user is then redirected to the page showing all reviews of the remix.
 */
function EditRemixReviewForm({editRemixReviewFunc}) {
  const navigate = useNavigate();
  const {reviewId} = useParams();
  const location = useLocation();
  //locationRemix = state passed in from the /remixes/:remixId aka remix details page route, contains {remixId, remixName}
  const {remixId, remixName} = location.state;

  const [editRemixReviewFormData, setEditRemixReviewFormData] = useState({});
  const [editRemixReviewFormErrors, setEditRemixReviewFormErrors] = useState([]);

  //retrieve info about the current version of the remix review.
  // While this is happening, the word "Loading" is displayed on the screen. The form won't be displayed 
  // until the existing information of the remix review is returned from the API.
  useEffect(function loadRemixReviewWhenMounted() {
    async function fetchRemixReview() {
      const currentRemixReview = await RemixApi.getRemixReview(reviewId);
      setEditRemixReviewFormData({
        title: currentRemixReview.title,
        content: currentRemixReview.content
      });
    }
    fetchRemixReview();
  }, [reviewId]);

  /**
   * Handles form submission. Calls the function editRemixReviewFunc prop, which should contain
   * a call to the RemixApi to process the form inputs and then send a request to the backend to validate the inputs
   * and attempt to update the remix review in the database with the information contained in the inputs.
   * If successful, the remix review is updated in the database and the user will be taken to
   * the remix's full remix reviews page.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let editRemixReviewResult = await editRemixReviewFunc(reviewId, editRemixReviewFormData);
    if (editRemixReviewResult.successful) {
      navigate(`/remixes/${remixId}/reviews`, {state: {remixName}});
    } else {
      setEditRemixReviewFormErrors(editRemixReviewResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setEditRemixReviewFormData(editRemixReviewFormData => ({...editRemixReviewFormData, [name]: value}));
  }

  if (!(Object.keys(editRemixReviewFormData).length)) return <h1>Loading...</h1>

  return (
    <div className="EditRemixReviewForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Edit Review for the remix <Link className="EditRemixReviewForm-remix-details-link" to={`/remixes/${remixId}`}>
            {remixName}
          </Link>
        </h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="EditRemixReviewForm-name-field">Review title (1-100 characters) </label>
                <input
                    id="EditRemixReviewForm-title-field"
                    type="text"
                    name="title"
                    className="form-control"
                    value={editRemixReviewFormData.title}
                    minlength="1"
                    maxlength="100"
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="EditRemixReviewForm-content-field">Content </label>
                <textarea
                    id="EditRemixReviewForm-content-field"
                    name="content"
                    className="form-control"
                    value={editRemixReviewFormData.content}
                    rows="3"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please type our your review here"
                    required
                ></textarea>
              </div>

              {editRemixReviewFormErrors.length ? <Alert alertTexts={editRemixReviewFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Update Review
              </button>
            </form>
            <p>If the review is successfully updated, you'll be redirected to the remix's reviews page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRemixReviewForm;