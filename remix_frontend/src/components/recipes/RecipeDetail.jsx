import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";

import RemixApi from "../../api/api.js";
import RemixList from "../remixes/RemixList.jsx";
import RecipeReviewsPreview from "./RecipeReviewsPreview.jsx";

/**
 * Recipe Details page top-level component.
 * This is the page that shows full detailed information about a recipe including ingredients, directions, number of servings, cooking time,
 * the user who created it, etc. which will then be followed by the list of Remixes of the recipe presented as a RemixList component
 * of RemixCard components, followed by the most recently added review of the recipe as a RecipeReviewsPreview component, which contains
 * a link to the page that lists out all recipe reviews of the recipe.
 * 
 * Route is /recipes/:recipeId
 * 
 * Contains the RemixList and the RecipeReviewsPreview components.
 * 
 */
function CompanyDetail() {
  const {name} = useParams();
  const [companyInfo, setCompanyInfo] = useState(null);

  //retrieve detailed info about company, including its list of job openings, from the API.
  // While this is happening, the word "Loading" is displayed on the screen. Company and job information won't be displayed 
  // until the information is returned from the API.
  useEffect(function loadComapnyDetailsWhenMounted() {
    async function fetchCompanyDetailsAndJobs() {
      const company = await JoblyApi.getCompany(name);
      setCompanyInfo(company);
    }
    fetchCompanyDetailsAndJobs();
  }, [name]);

  if (!companyInfo) return <h1>Loading...</h1>

  return (
    <div className="CompanyDetail col-md-8 offset-md-2">
      <h3 className="CompanyDetail-headline">Current Openings for {companyInfo.name}</h3>
      <p className="CompanyDetail-description">{companyInfo.description}</p>
      <p className="CompanyDetail-employees">Current number of employees: {companyInfo.numEmployees}</p>
      <JobPostingList listOfJobs={companyInfo.jobs} isGeneral={false} />
    </div>
  );
}

export default CompanyDetail;