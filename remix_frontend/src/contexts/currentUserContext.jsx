/**
 * This is the currentUserContext hook. It will mainly be used to store information about the current logged in user, which will
 * be needed by many components throughout the app. It may also contain some methods involved such as creating a recipe,
 * updating a recipe, etc. which will require some changes to certain pieces of state.
 */

import React, {createContext} from "react";

const CurrentUserContext = createContext();

export default CurrentUserContext;