import React, { useState } from 'react';
import axios from 'axios';
import Pantry from './components/Pantry';
import RecipeCard from './components/RecipeCard';
import Favorites from './components/Favorites';
import { Search, Heart, Star, X } from 'lucide-react';

const API_KEY = '9ce9f8e3644f4e018c750c7aa72c6d3a'; // Paste your key


function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [favoriteDetails, setFavoriteDetails] = useState(null);
  const [recipeSearch, setRecipeSearch] = useState('');

  const fetchRecipes = async () => {
    if (ingredients.length < 1) return alert('Add some ingredients!');
    setLoading(true);
    try {
      const query = ingredients.join(', ');
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${query}&number=8&apiKey=${API_KEY}&ranking=2`
      );
      setRecipes(response.data);
    } catch (error) {
      alert('Error fetching recipes!');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchRecipeDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
      );
      setRecipeDetails(response.data);
      setSelectedRecipe(id);
    } catch (error) {
      alert('Error fetching recipe details!');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchFavoriteDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
      );
      setFavoriteDetails(response.data);
      setSelectedFavorite(id);
    } catch (error) {
      alert('Error fetching favorite details!');
      console.error(error);
    }
    setLoading(false);
  };

  const searchRecipesByName = async () => {
    if (!recipeSearch.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${recipeSearch}&number=8&apiKey=${API_KEY}`
      );
      setRecipes(response.data.results);
    } catch (error) {
      alert('Error searching recipes!');
      console.error(error);
    }
    setLoading(false);
  };

  const closeModal = (type) => {
    if (type === 'recipe') {
      setSelectedRecipe(null);
      setRecipeDetails(null);
    } else {
      setSelectedFavorite(null);
      setFavoriteDetails(null);
    }
  };

  const addFavorite = (recipe) => {
    const newFav = { ...recipe, rated: 0 };
    const updated = [...favorites, newFav];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const rateRecipe = (id, rating) => {
    const updated = favorites.map(fav => fav.id === id ? { ...fav, rated: rating } : fav);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>🧑‍🍳 Recipe Remix</h1>
          <p>Zero Waste Recipe Generator - Use what you have at home!</p>
          <div className="zero-waste-tag">Reduce Food Waste</div>
        </div>
      </header>

      <main className="container">
        <div className="main-content">
          <section className="pantry-section">
            <h2>
              <Search size={24} style={{ marginRight: '8px' }} /> Your Pantry
            </h2>
            <Pantry ingredients={ingredients} setIngredients={setIngredients} />
            <button
              onClick={fetchRecipes}
              disabled={loading || ingredients.length === 0}
              className="see-recipes-btn"
            >
              {loading ? 'Finding Recipes...' : 'See Recipes'}
            </button>
          </section>
          <section className="recipe-section">
            <h2>
              <Search size={24} style={{ marginRight: '8px' }} /> Recipe Suggestions
            </h2>
            <div className="recipe-search">
              <input
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                placeholder="Search recipes by name..."
                onKeyPress={(e) => e.key === 'Enter' && searchRecipesByName()}
              />
              <button onClick={searchRecipesByName}>
                <Search size={20} />
              </button>
            </div>
            {recipes.length > 0 && (
              <div className="recipe-grid">
                {recipes.map((recipe) => (
                  <div onClick={() => fetchRecipeDetails(recipe.id)} key={recipe.id}>
                    <RecipeCard recipe={recipe} onFavorite={() => addFavorite(recipe)} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        <section className="favorites-section">
          <Favorites favorites={favorites} onRate={rateRecipe} onViewDetails={fetchFavoriteDetails} />
        </section>
        <div className="footer-banner">
          <div className="about">
            <h3>About Us</h3>
            <p>Recipe Remix helps you create delicious meals with what you have, reducing food waste!</p>
          </div>
          <div className="contact">
            <h3>Contact</h3>
            <p>Email: support@recipremix.com | Phone: +1-800-REMIX</p>
          </div>
        </div>
      </main>

      {/* Modal for Recipe Suggestions */}
      {selectedRecipe && recipeDetails && (
        <div className="modal-overlay" onClick={() => closeModal('recipe')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => closeModal('recipe')} className="modal-close">
              <X size={24} />
            </button>
            <h2>{recipeDetails.title}</h2>
            <img src={recipeDetails.image} alt={recipeDetails.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
            <p>Ready in {recipeDetails.readyInMinutes} mins | Serves {recipeDetails.servings}</p>
            <h3>Ingredients:</h3>
            <ul className="modal-ingredients">
              {recipeDetails.extendedIngredients.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <div className="modal-instructions">
              <ol>
                {recipeDetails.analyzedInstructions[0]?.steps.map((step) => (
                  <li key={step.number}>{step.step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Favorites */}
      {selectedFavorite && favoriteDetails && (
        <div className="modal-overlay" onClick={() => closeModal('favorite')}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => closeModal('favorite')} className="modal-close">
              <X size={24} />
            </button>
            <h2>{favoriteDetails.title}</h2>
            <img src={favoriteDetails.image} alt={favoriteDetails.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }} />
            <p>Ready in {favoriteDetails.readyInMinutes} mins | Serves {favoriteDetails.servings}</p>
            <h3>Ingredients:</h3>
            <ul className="modal-ingredients">
              {favoriteDetails.extendedIngredients.map((ing) => (
                <li key={ing.id}>{ing.original}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <div className="modal-instructions">
              <ol>
                {favoriteDetails.analyzedInstructions[0]?.steps.map((step) => (
                  <li key={step.number}>{step.step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;