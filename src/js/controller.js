import * as model from './model.js';
import recipeView from './views/recipe.js';
import searchView from './views/search.js';
import resultsView from './views/results.js';
import paginationView from './views/pagination.js';
import bookmarksView from './views/bookmarks.js';
import addRecipeView from './views/addRecipe.js';

const recipeContainer = document.querySelector('.recipe');

// ejemplo: https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40

///////////////////////////////////////

const controlRecipes = async function() {
  try {

    const [ _, id] = window.location.hash.split('#');

    if (!id) return;

    recipeView.renderSpinner();

    
    await model.loadRecipe(id);
    
    recipeView.render(model.state.recipe);
    
    resultsView.update(model.getSearchResultsPage());
  } catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    
    await model.loadSerchResults(query);
    
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
}

const controlServings = function(newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}

const controlPagination = function(page){
  model.state.search.page = page;
  resultsView.render(model.getSearchResultsPage());

  paginationView.render(model.state.search);
}

const controlToggleBookmark = function(){
  
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {

  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage('Recipe uploaded!');
    addRecipeView.toggleWindow();

    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

  } catch(err) {
    addRecipeView.renderError(err.message);
  }
}

const init = function() {
  bookmarksView.render(model.state.bookmarks);

  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerToggleBookmark(controlToggleBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();