import React from 'react';
import { Star } from 'lucide-react';

function Favorites({ favorites, onRate, onViewDetails }) {
  if (favorites.length === 0) return <p style={{ textAlign: 'center', color: '#999' }}>No favorites yet. Save some recipes!</p>;

  const grouped = favorites.reduce((acc, recipe) => {
    const cat = recipe.category || 'Other';
    acc[cat] = acc[cat] || [];
    acc[cat].push(recipe);
    return acc;
  }, {});

  const renderStars = (rating, id) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => onRate(id, i)}
          className={i <= rating ? 'filled' : ''}
        >
          <Star size={20} />
        </button>
      );
    }
    return stars;
  };

  return (
    <section className="favorites-section">
      <h2>Your Saved Recipes</h2>
      <ul className="favorites-list">
        {Object.keys(grouped).flatMap((cat) =>
          grouped[cat].map((recipe) => (
            <li
              key={recipe.id}
              className="favorite-item"
              onClick={() => onViewDetails(recipe.id)}
            >
              <h4>{recipe.title}</h4>
              <div className="star-rating">
                {renderStars(recipe.rated, recipe.id)}
              </div>
              <p>Rated: {recipe.rated}/5</p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default Favorites;