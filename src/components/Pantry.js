import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';

const categories = [
  { name: 'Pantry Essentials', icon: '🛒', ingredients: ['butter', 'egg', 'garlic', 'milk', 'onion', 'sugar', 'flour', 'olive oil', 'garlic powder', 'white rice', 'cinnamon', 'ketchup', 'soy sauce', 'mayonnaise', 'vegetable oil', 'salt', 'pepper', 'baking powder', 'baking soda', 'vinegar'] },
  { name: 'Vegetables & Greens', icon: '🥦', ingredients: ['garlic', 'onion', 'bell pepper', 'scallion', 'carrot', 'tomato', 'potato', 'red onion', 'celery', 'avocado', 'zucchini', 'cherry tomato', 'lettuce', 'spinach', 'broccoli', 'cucumber', 'eggplant', 'mushroom', 'cabbage', 'cauliflower'] },
  { name: 'Fruits', icon: '🍎', ingredients: ['apple', 'banana', 'orange', 'lemon', 'lime', 'strawberry', 'blueberry', 'grape', 'pineapple', 'mango', 'kiwi', 'peach', 'pear', 'watermelon', 'cherry', 'raspberry', 'apricot', 'plum', 'coconut', 'fig'] },
  { name: 'Nuts and Seeds', icon: '🥜', ingredients: ['almond', 'walnut', 'peanut', 'cashew', 'pecan', 'pistachio', 'chia seed', 'flax seed', 'pumpkin seed', 'sunflower seed', 'sesame seed', 'hazelnut', 'macadamia', 'brazil nut', 'pine nut', 'coconut flake', 'hemp seed'] },
  { name: 'Cheese, Dairy and Eggs', icon: '🧀', ingredients: ['cheddar cheese', 'mozzarella', 'parmesan', 'cream cheese', 'yogurt', 'butter', 'milk', 'cream', 'sour cream', 'egg', 'feta', 'goat cheese', 'ricotta', 'cottage cheese', 'whipped cream', 'half and half'] },
  { name: 'Meats', icon: '🍖', ingredients: ['chicken', 'beef', 'pork', 'turkey', 'bacon', 'sausage', 'ham', 'ground beef', 'lamb', 'salmon', 'tuna', 'shrimp', 'cod', 'tilapia', 'duck', 'venison', 'prosciutto', 'chorizo'] },
  { name: 'Sugars', icon: '🍬', ingredients: ['white sugar', 'brown sugar', 'honey', 'maple syrup', 'agave nectar', 'powdered sugar', 'molasses', 'corn syrup', 'stevia', 'coconut sugar', 'date sugar', 'cane sugar', 'turbinado sugar'] },
  { name: 'Herbs and Spices', icon: '🌿', ingredients: ['basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro', 'mint', 'dill', 'cumin', 'paprika', 'chili powder', 'cinnamon', 'nutmeg', 'ginger', 'turmeric', 'curry powder', 'cayenne pepper', 'black pepper', 'salt'] },
];

function Pantry({ ingredients, setIngredients }) {
  const [inputValue, setInputValue] = useState('');
  const [openCategories, setOpenCategories] = useState([]);

  const toggleCategory = (name) => {
    setOpenCategories((prev) => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const addFromCategory = (ing) => {
    if (!ingredients.includes(ing)) {
      setIngredients([...ingredients, ing]);
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="search-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add ingredient (e.g., eggs)"
          onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
        />
        <button onClick={addIngredient}>
          <Plus size={20} />
        </button>
      </div>

      <div className="ingredient-chips">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient} className="chip">
            {ingredient}
            <button onClick={() => removeIngredient(index)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="categories">
        {categories.map((cat) => (
          <div key={cat.name} className="category-section">
            <div className="category-header" onClick={() => toggleCategory(cat.name)}>
              <span>{cat.icon} {cat.name} ({cat.ingredients.length})</span>
              <ChevronDown size={20} style={{ transform: openCategories.includes(cat.name) ? 'rotate(180deg)' : 'none' }} />
            </div>
            {openCategories.includes(cat.name) && (
              <div className="category-content">
                {cat.ingredients.map((ing) => (
                  <button key={ing} onClick={() => addFromCategory(ing)}>
                    + {ing}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pantry;