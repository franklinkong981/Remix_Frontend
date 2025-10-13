import React, {useState} from "react";
import {useNavigate, useParams, useLocation, Link} from "react-router-dom";

import Alert from "../reusables/Alert.jsx";

/** Form to add a new remix review, used by logged in user. Users provide the title and content of the review.
 * 
 * Top level component of the route /remixes/:remixId/reviews/new.
 * 
 * This component shows the form and manages the update to form fields as user types in data.
 * 
 * Upon submission:
 * - Communicates with the backend, which checks to see if each field submitted has a valid input.
 * - If one or more fields do not have valid inputs, return errors as Alert components. 
 * - Calls the RemixApi which communicates with backend to add a new remix review to the database using the data submitted from the form.
 * - If successful, the new remix review is successfully created in the database. 
 * - The user is then redirected to the page showing all reviews of the remix.
 */
function NewRemixReviewForm({addRemixReviewFunc}) {
  const navigate = useNavigate();
  const {remixId} = useParams();
  const location = useLocation();
  //locationRemix = state passed in from the /remixes/:remixId aka recipe details page route, contains {remixName}
  const {remixName} = location.state;

  const [newRemixReviewFormData, setNewRemixReviewFormData] = useState({
    title: "",
    content: ""
  });
  const [newRemixReviewFormErrors, setNewRemixReviewFormErrors] = useState([]);

  /**
   * Handles form submission. Calls the function addRemixReviewFunc prop, which should contain
   * a call to the RemixApi to process the form inputs and then send a request to the backend to validate the inputs
   * and attempt to add a new remix review to the database with the information contained in the inputs.
   * If successful, the new remix review is created in the database and the user will be taken to
   * the remix's full remix reviews page, where the review they just created will be listed at the top.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let addRemixReviewResult = await addRemixReviewFunc(remixId, newRemixReviewFormData);
    if (addRemixReviewResult.successful) {
      navigate(`/remixes/${remixId}/reviews`, {state: {remixName}});
    } else {
      setNewRemixReviewFormErrors(addRemixReviewResult.errors);
    }
  }

  function handleChange(evt) {
    const {name, value} = evt.target;
    setNewRemixReviewFormData(newRemixReviewFormData => ({...newRemixReviewFormData, [name]: value}));
  }

  return (
    <div className="NewRemixReviewForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Add a New Review for the Remix <Link className="NewRemixReviewForm-remix-details-link" to={`/remixes/${remixId}`}>
            {remixName}
          </Link>
        </h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="NewRemixReviewForm-name-field">Review title (1-100 characters) </label>
                <input
                    id="NewRemixReviewForm-title-field"
                    type="text"
                    name="title"
                    className="form-control"
                    value={newRemixReviewFormData.title}
                    minlength="1"
                    maxlength="100"
                    onChange={handleChange}
                    required
                />
              </div>

              <div className="form-group">
                <label htmlFor="NewRemixReviewForm-content-field">Content </label>
                <textarea
                    id="NewRemixReviewForm-content-field"
                    name="content"
                    className="form-control"
                    value={newRemixReviewFormData.content}
                    rows="3"
                    cols="50"
                    onChange={handleChange}
                    placeholder="Please type our your review here"
                    required
                ></textarea>
              </div>

              {newRemixReviewFormErrors.length ? <Alert alertTexts={newRemixReviewFormErrors} /> : null}

              <button type="submit" className="btn btn-primary float-right" onSubmit={handleSubmit}>
                Add Review
              </button>
            </form>
            <p>If the new review is successfully created, you'll be redirected to the remix's reviews page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewRemixReviewForm;