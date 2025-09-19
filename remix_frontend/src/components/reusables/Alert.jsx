/**
 * Alert is a presentational component (like flash messages) for showing Bootstrap-style alerts on the page.
 * Will be used in most form components in the app.
 * Whenever there is an error with form submission/authentication, the error messages will be displayed in this alert style
 * at the bottom of the form.
 * 
 * Default alert type will be danger (red), but can set alertType prop to "success" for a green positive alert message.
 */

import React from "react";
import {v4 as uuidv4} from "uuid";


function Alert({alertType = "danger", alertTexts = []}) {
  return (
    <div className={`alert alert-${alertType}`} role="alert">
      {alertTexts.map(error => (
        <p className="mb-0 small" key={uuidv4()}>
          {error}
        </p>
      ))}
    </div>
  );
}

export default Alert;