import React, {useState, useEffect} from "react";

import RecipeCard from "./RecipeCard.jsx";

import {v4 as uuidv4} from "uuid";

/**
 * Component that shows a list of recipes, with each recipe being a RecipeCard component.
 * Is used for pages that show a specific list of recipes.
 * 
 * No state in this component, the list of recipes (an array of recipe objects) to display is passed in.
 * 
 * Contains RecipeCard components.
 */
function RecipeList({recipes}) {

  return (
    <div className="RecipeList col-md-8 offset-md-2">
      {recipes.length ? (
        <div className="RecipeList-list">
          {recipes.map(recipe => (
            <RecipeCard key={uuidv4()} 
              id={recipe.id} 
              name={recipe.name} 
              description={recipe.description}
              recipeAuthor={recipe.recipeAuthor || ""}
              imageUrl={recipe.imageUrl}
              createdAt={recipe.createdAt}
            />
          ))}
        </div>
      ) : <p className="RecipeList-no-recipes">No recipes found</p>}
    </div>
  );
}

export default RecipeList;