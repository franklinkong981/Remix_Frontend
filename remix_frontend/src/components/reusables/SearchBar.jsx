import React, {useState} from "react";
import "./SearchBar.css";

/**
 * Search bar that will be displayed at the top of some pages.
 * Users can type in a query in the search bar and submit it to search for the topic on the page, whether it be users, recipes, etc.
 * 
 * Once the search query is typed out and the search button is clicked,, the filterFunc function prop is called to filter the results
 * so that only the matching results remain displayed on the page.
 * 
 * Generally, if the user then changes the search query back to blank and clicks the search button again, all results will be redisplayed. 
 * 
 * For now, there is only one page that uses the SearchBar component: The search for recipes page. Searching for users is planned
 * in the future.
 */
function SearchBar({filterFunc, placeholder}) {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSubmit(evt) {
    evt.preventDefault();
    //If the search query is empty or just empty spaces, no parameter is passed to filterFunc and all results are displayed.
    searchQuery.trim() ? filterFunc(searchQuery.trim()) : filterFunc();
    setSearchQuery(searchQuery => searchQuery.trim());
  }

  /** Used to update the value in the searchbar at any given time. */
  function handleChange(evt) {
    setSearchQuery(searchQuery => evt.target.value);
  }

  return (
    <div className="SearchBar mb-4">
      <form className="SearchBar-form form-inline" onSubmit={handleSubmit}>
        <input
          className="SearchBar-input form-control form-control-lg flex-grow-1"
          name="searchQuery"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
        />
        <button type="submit" className="SearchBar-submit btn btn-lg btn-primary">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;