import React, {useState, useEffect} from "react";

import RecipeCard from "../recipes/RecipeCard.jsx";
import RemixApi from "../../api/api.js";

import {v4 as uuidv4} from "uuid";

/**
 * Top-level component for the page that shows the list of recipes belonging to a specific user.
 * When page loads, loads companies from APi and displays them.
 * Contains SearchBar which reloads filtered companies on submission.
 * 
 * Route: /companies
 * 
 * Contains SearchBar, CompanyCard (each company is displayed in CompanyCard component).
 */
function CompanyList() {
  const [listOfCompanies, setListOfCompanies] = useState(null);

  //retrieve companies data from database. While this is happening,
  // the "loading" text appears on the page.
  // Company list won't be displayed until company data is returned from Api.
  useEffect(function loadCompaniesWhenMounted() {
    async function fetchCompanies() {
      const companies = await JoblyApi.getAllCompanies();
      setListOfCompanies(companies);
    }
    fetchCompanies();
  }, []);

  /**
   * Filters companies to display that match the search query, triggered upon search bar submission.
   * Calls the API to return filtered companies and reloads the CompanyList component which now only displays filtered companies.
   */
  const filterCompanySearch = async (searchQuery) => {
    let filteredCompanies;
    if (searchQuery) {
      filteredCompanies = await JoblyApi.getFilteredCompaniesByName(searchQuery);
    } else {
      filteredCompanies = await JoblyApi.getAllCompanies();
    }

    setListOfCompanies(listOfCompanies => filteredCompanies);
  };
  
  if (!listOfCompanies) {
    return <h1>Loading...</h1>
  }
  
  return (
    <div className="CompanyList col-md-8 offset-md-2">
      <SearchBar filterFunc={filterCompanySearch} placeholder="Search for companies"/>
      {listOfCompanies.length ? (
        <div className="CompanyList-list">
          {listOfCompanies.map(company => (
            <CompanyCard id={company.handle} name={company.name} description={company.description} key={uuidv4()}/>
          ))}
        </div>
      ) : <p className="CompanyList-no-companies">No companies found</p>}
    </div>
  );
}

export default CompanyList;