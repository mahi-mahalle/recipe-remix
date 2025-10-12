import React from 'react';
import { Heart, Star } from 'lucide-react';

function RecipeCard({ recipe, onFavorite }) {
  const avgRating = recipe.aggregateLikes / 100;

  return (
    <div className="recipe-card">
      <img
        src={recipe.image || 'https://via.placeholder.com/280x200?text=No+Image'}
        alt={recipe.title}
      />
      <div className="recipe-card-content">
        <span className="zero-waste-tag">{recipe.category || 'Main'}</span>
        <h3>{recipe.title}</h3>
        <p>Ready in {recipe.readyInMinutes} mins | Serves {recipe.servings}</p>
        <div className="recipe-rating">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill={i < avgRating ? '#d4b266' : 'none'} />
          ))}
          <span>({recipe.aggregateLikes} likes)</span>
        </div>
        <ul className="recipe-ingredients">
          {recipe.usedIngredients?.slice(0, 3).map((ing) => (
            <li key={ing.id}>{ing.name}</li>
          ))}
          {recipe.missedIngredients?.length > 0 && (
            <li style={{ color: '#ff9800' }}>Needs: {recipe.missedIngredients[0].name}</li>
          )}
        </ul>
        <button onClick={onFavorite} className="favorite-btn">
          <Heart size={16} style={{ marginRight: '4px' }} /> Save Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;