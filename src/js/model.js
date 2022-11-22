import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RESULTS_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
    recipe: {},
    search: {
      query: '',
      results: [],
      resultsPerPage: RESULTS_PAGE,
      page: 1
    },
    bookmarks: []
}

export const loadRecipe = async function(id) {

    try{
      const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);
    
      const { recipe } = data.data;

      state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
      }

      state.recipe.bookmarked = state.bookmarks.some(bm => bm.id === id) ?  true : false;

  } catch(err) {
    throw err;
  }
}

export const loadSerchResults = async function(query) {

  try{

    state.search.query = query;
    if (!query) return;

    const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key })
      }
    });

    state.search.page = 1;

  } catch(err) {
    throw err;
  }
}

export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;

  const start = (page -1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
}

export const updateServings = function(newServings = state.recipe.servings){
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings; // cantidad * nuevas porciones / cantidad original de porciones
  })

  state.recipe.servings = newServings;
}

const persistBookmarks = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
}

export const removeBookmark = function(id) {

  state.bookmarks.splice(state.bookmarks.findIndex(rec => rec.id === id), 1);
  state.recipe.bookmarked = false;

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
}

export const uploadRecipe = async function(newRecipe) {

  try {
    const ingredients = Object.entries(newRecipe).filter(rec => rec[0].startsWith('ingredient') && rec[1] !== '')
    .map(ingredient => {
      const ingredientsArray = ingredient[1].split(',').map(el => el.trim());

      if (ingredientsArray.length !== 3) throw new Error('Wrong ingredient format. Please use the correct one')

      const [ quantity, unit, description ] = ingredientsArray;
      
      return { quantity: quantity ? +quantity : null, unit, description };
    });
    
    let recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients 
    }

    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);

    const returnData = data.data.recipe;

    state.recipe = {
      id: returnData.id,
      title: returnData.title,
      publisher: returnData.publisher,
      sourceUrl: returnData.source_url,
      image: returnData.image_url,
      servings: returnData.servings,
      cookingTime: returnData.cooking_time,
      ingredients: returnData.ingredients,
      ...(returnData.key && { key: returnData.key })
    }

    addBookmark(state.recipe);

  } catch(err) {
    throw err;
  }

}

const init = function() {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
}

init();