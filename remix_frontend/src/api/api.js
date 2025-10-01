import axios from "axios";


//const BASE_URL = "http://localhost:3001";
const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3001";

/** This is the top-level API class for the Remix backend that the frontend will interact with for operations such as
 *  registering a new user/authenticating a user, fetching a user's recipes, remixes, and/or reviews, as well as
 *  adding a new recipe/remix or updating a logged in user's reicpe/remix.
 * 
 * This is a static class tying together methods used to get/send to the API. There 
 * won't be any frontend-specific stuff here, and there won't be any API-aware stuff
 * elsewhere in the frontend.
 * 
 * All React components in frontend will interact through methods in this file to retrieve information from backend.
 * This is so that there won't be calls to the backend/processing the data returned all throughout the frontend React component files.
 */

class RemixApi {
  //Whenever a user signs up/logs in to Remix, they'll be issued a token which they'll need to 
  //access most of the routes. This token will be stored here.

  static token;

  //The main reusable method that will be called whenever the front end wants to send a request
  // to a certain route in the backend. The default method is get, and data parameter = what will be sent as req.body object.

  static async request(endpoint, data = {}, method = "get") {
    console.log("API Call: ", endpoint, data, method);

    //This is one way to pass an authorization token: As part of the header.
    const url = `${BASE_URL}/${endpoint}`;
    console.log("URL for API call: ", url);
    const headers = (RemixApi.token) ? {authorization: `${RemixApi.token}`} : {};
    const params = (method === "get") ? data : {};

    try {
      return (await axios({url, method, data, params, headers})).data;
    } catch(err) {
      console.error("API Error: ", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  //Individual API routes

  /** Signs the user in, adds the new user information to the database, and generates a new token for the user.
   * The signupFormValues will contain the new user's username, password, first name, last name, and email.
   */
  static async signUp(signUpFormValues) {
    let res = await this.request(`auth/register`, signUpFormValues, "post");
    return res.message;
  }

  /** Logs in the user. The loginFormValues will contain the user's username and password. If the user is authenticated and
   * they are successful, logs the user in.
   */
  static async login(loginFormValues) {
    let res = await this.request(`auth/login`, loginFormValues, "post");
    return res.token;
  }

  /** Gets information about the current logged in user. Gets their username, email, 3 most recent recipes, and 3 most recent remixes.  */
  static async getCurrentLoggedInUser(username) {
    let res = await this.request(`users/${username}`);
    return res.userDetails;
  }

  /** Updates logged in user's information in the database. Can update username and email. Returns updated username and email. */
  static async updateUserProfile(username, updateProfileFormValues) {
    let res = await this.request(`users/${username}`, updateProfileFormValues, "patch");
    return res;
  }

  /** Retrieves basic information on all recipes belonging to a specific user in chronological order, most recent first. */
  static async getUsersRecipes(username) {
    let res = await this.request(`users/${username}/recipes`);
    return res.allUserRecipes;
  }

  /** Retrieves basic information on all remixes belonging to a specific user in chronological order, most recent first. */
  static async getUsersRemixes(username) {
    let res = await this.request(`users/${username}/remixes`);
    return res.allUserRemixes;
  }

  /** Retrieves every recipe review made by a specific user in chronological order, most recent first. */
  static async getUsersRecipeReviews(username) {
    let res = await this.request(`users/${username}/reviews/recipes`);
    return res.userRecipeReviews;
  }

  /** Retrieves every remix review made by a specific user in chronological order, most recent first. */
  static async getUsersRemixReviews(username) {
    let res = await this.request(`users/${username}/reviews/remixes`);
    return res.userRemixReviews;
  }

  /** Retrieves basic info about every recipe in the database, such as its id, name, description, etc. by recipe name in alphabetical order. */
  static async getAllRecipes() {
    let res = await this.request(`recipes`);
    return res.recipeSearchResults;
  }
}

//For now, this is the test user that will be used to test the code while it is under development.
//This is the token that will be given to a user with username = "testuser", password = "password"
/* RemixApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
"SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
"FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc"; */

export default RemixApi;